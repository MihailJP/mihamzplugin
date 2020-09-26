//=============================================================================
// RPG Maker MZ - 戦闘中のセリフ表示
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Displays dialogue in battle
 * @author MihailJP
 * @base PluginCommonBase
 * @base ExtraWindow
 * @orderBefore TPBCastTime
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/SpeakInBattle.js
 *
 * @param duration
 * @text Display duration
 * @desc Set display duration by frames (sixtieth of a second).
 * @default 60
 * @type number
 * @min 0
 *
 * @param switchId
 * @text Display switch number
 * @desc Set switch number specified at `ExtraWindow` plugin.
 *       Uses 8 switches of sequential number starting at this number.
 * @default 1
 * @type switch
 *
 * @help SpeakInBattle.js
 *
 * Sets dialogues displayed during battle. Unlike message window,
 * small and input-wait-free.
 * This plugin supports the front-view battle screen only.
 *
 * Set memo of an enemy character like <BattleMsg1:Take this!>
 * (includes angle brackets).
 * Set memo of a skill like <enemySpeaks:1,2,3> to display messages of given
 * IDs (random if more than one) when an enemy character uses that skill.
 * Also, there is `speakPredefined` command to display message with given
 * enemy character index and message ID (the number after `BattleMsg`).
 *
 * This depends on `ExtraWindow` plugin.
 * On `ExtraWindow` configuration, requires 8 windows whose `SceneName` is
 * "Scene_Battle" and `SwitchId` is sequential.
 * `x`, `y` and `width` are ignored since position and width are auto-adjusted.
 *
 * License: The Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt * Changelog
 *
 * 26 Sept 2020: Improve compatibility with TPBCastTime.
 * 21 Sept 2020: First edition.
 *
 * @command speakPredefined
 * @text Display predefined message
 * @desc Display predefined message.
 *
 * @arg enemy_index
 * @type number
 * @text Enemy character index
 * @desc Enemy character index.
 * @min 1
 * @max 8
 *
 * @arg message_id
 * @type number
 * @text Message ID
 * @desc Message ID.
 */
/*:ja
 * @target MZ
 * @plugindesc 戦闘中のセリフ表示
 * @author MihailJP
 * @base PluginCommonBase
 * @base ExtraWindow
 * @orderBefore TPBCastTime
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/SpeakInBattle.js
 *
 * @param duration
 * @text 表示時間
 * @desc 表示時間をフレーム単位で指定します。
 * @default 60
 * @type number
 * @min 0
 *
 * @param switchId
 * @text 表示スイッチID
 * @desc ExtraWindowプラグインで指定したスイッチ番号を指定します。
 *       ここで指定した番号から連番で8つが対象になります。
 * @default 1
 * @type switch
 *
 * @help SpeakInBattle.js
 *
 * 戦闘中に表示される台詞を設定します。メッセージウィンドウと違って小さく
 * 入力待ちがありません。
 * このプラグインはフロントビュー戦闘にのみ対応しています。
 *
 * 敵キャラのメモ欄に <BattleMsg1:〇〇〇〇〇> のように設定しておきます。
 * スキルのメモ欄に <enemySpeaks:1,2,3> のように設定することで、そのスキルを
 * 敵が使用したときに、指定したメッセージIDのメッセージが登録されていれば
 * そのメッセージ（複数指定されている場合はランダム）が表示されます。
 * また、speakPredefined コマンドで敵インデックスとメッセージID
 *（BattleMsgの後の番号）を指定して表示することもできます。
 *
 * このプラグインは ExtraWindow プラグインを利用します。
 * ExtraWindow側で、SceneName を "Scene_Battle"、SwitchId を連番にした
 * 8つのウィンドウを用意しておく必要があります。
 * x、y、width の設定は無視されます。位置とウィンドウ幅は自動調整されます。
 *
 * ライセンス: Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt
 *
 * 更新履歴
 * 令和2年9月26日 TPBCastTimeとの互換性を改良
 * 令和2年9月21日 初版
 *
 * @command speakPredefined
 * @text 定型メッセージを表示
 * @desc 定義済みのメッセージを表示します。
 *
 * @arg enemy_index
 * @type number
 * @text 敵インデックス
 * @desc 敵インデックスを指定します。
 * @min 1
 * @max 8
 *
 * @arg message_id
 * @type number
 * @text メッセージID
 * @desc メッセージIDを指定します。
 */

(() => {
	const pluginName = "SpeakInBattle";
	const param = PluginManagerEx.createParameter(document.currentScript);
	let windowFrameBegin = [0, 0, 0, 0, 0, 0, 0, 0];

	const getEnemy = function(enemyIndex) {
		return $gameTroop.members()[parseInt(enemyIndex) - 1].enemy();
	}
	const speakMsg = function(enemyIndex, msg) {
		let windowList = SceneManager._scene._extraWindows;
		const enemy = $gameTroop.members()[parseInt(enemyIndex) - 1];
		
		if (typeof msg !== 'string') {
			throw TypeError("msg is not a string");
		}
		
		const bitmap = ImageManager._cache["img/enemies/" + encodeURIComponent(getEnemy(enemyIndex).battlerName) + ".png"];
		for (let i = 0; i < windowList.length; ++i) {
			if ((windowList[i]._data.SceneName == "Scene_Battle")
				&& (windowList[i]._data.SwitchId == param.switchId + enemyIndex - 1))
			{
				const getStringWidth = function(windowObj, msg) {
					return windowObj.contents.canvas.getContext('2d').measureText(msg).width
					* (windowObj._data.FontSize || $dataSystem.advanced.fontSize) / 10;
				};
				const stringWidth = getStringWidth(windowList[i], msg);
				const origWidth = getStringWidth(windowList[i], windowList[i]._text);
				if (stringWidth != origWidth) {
					// canvasとbaseTextureを作り直す
					windowList[i].contents.destroy();
					windowList[i].contents._createCanvas(windowList[i].innerWidth, windowList[i].innerHeight);
					// 大きさを測定
					windowWidth = Math.min(bitmap.width, windowList[i].width - windowList[i].innerWidth + stringWidth);
					// いったんデータを消去
					windowList[i]._data.Text = "Etaoin Shrdlu " + Date.now().toString();
					windowList[i].refresh();
					windowList[i]._text = "　";
					// 大きさを設定
					windowList[i]._data.x
						= windowList[i].x
						= enemy.screenX() - (windowWidth / 2);
					windowList[i]._data.y
						= windowList[i].y
						= enemy.screenY() - (bitmap.height / 2) - windowList[i].height;
					windowList[i]._data.width
						= windowList[i].width
						= windowWidth;
					windowList[i].contents.width
						= windowList[i].contents.baseTexture.width
						= windowList[i].innerWidth;
					windowList[i].contents.canvas.width
						= Math.max(windowList[i].innerWidth, stringWidth);
				}
				// 実際に表示する
				if (msg != "") {
					$gameSwitches.setValue(windowList[i]._data.SwitchId, true);
					windowFrameBegin[parseInt(enemyIndex) - 1] = Graphics.frameCount;
					windowList[i]._data.Text = msg;
				} else {
					windowList[i]._data.Text = "Kilroy was here " + Date.now().toString();
				}
				windowList[i].refresh();
			}
		}
	}
	const speakPredefined = function(enemy_index, message_id) {
		try {
			const enemy = getEnemy(parseInt(enemy_index));
			DataManager.extractMetadata(enemy);
			const msg = PluginManagerEx.findMetaValue(
				enemy, "BattleMsg" + String(message_id));
			
			speakMsg(parseInt(enemy_index), msg);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const autoClose = function() {
		for (let i = 0; i < 8; ++i) {
			if ($gameSwitches.value(param.switchId + i)) {
				if (windowFrameBegin[i] + param.duration < Graphics.frameCount) {
					$gameSwitches.setValue(param.switchId + i, false);
				}
			}
		}
	};
	
	/* rmmz_objects.js */
	const orig_Game_Screen_onBattleStart = Game_Screen.prototype.onBattleStart;
	Game_Screen.prototype.onBattleStart = function() {
		for (var i = 0; i < 8; ++i) {
			$gameSwitches.setValue(param.switchId + i, false);
		}
		orig_Game_Screen_onBattleStart.call(this);
	};
	const orig_Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		if ((!PluginManager._scripts.includes("TPBCastTime")
			|| (this._tpbState != "casting")) // キャスト時に2回表示されるのを防止
			&& this.isEnemy() // 敵の行動に限る
		) {
			try {
				DataManager.extractMetadata(item);
				const msgList = item.meta.enemySpeaks.split(',');
				speakPredefined((this.index() + 1).toString(), msgList[Math.randomInt(msgList.length - 1)]);
			} catch (e) {
				if (e instanceof TypeError) {
					console.log(e);
				} else {
					throw e;
				}
			}
		}
		orig_Game_Battler_useItem.call(this, item);
	};

	/* rmmz_scenes.js */
	const orig_Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		orig_Scene_Battle_update.call(this);
		autoClose();
	};

	PluginManagerEx.registerCommand(document.currentScript, "speakPredefined", args => {
		speakPredefined(args.enemy_index, args.message_id);
	});

})();
