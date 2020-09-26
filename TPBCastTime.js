//=============================================================================
// RPG Maker MZ - Implement wait TPB cast time
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Implement wait TPB cast time
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBCastTime.js
 *
 * @help TPBCastTime.js
 *
 * This plugin implements waiting (delay) for cast which is
 * incorrectly implemented as of version 1.0.0.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 26 Sept 2020: Fixed crash issue with out-of-battle skills.
 * 26 Sept 2020: Fixed issue forced action causes being stuck.
 *               Avoid cost duplicate.
 * 25 Sept 2020: First edition.
 *
 * @param flashWhenCastStarts
 * @text Flash when cast starts
 * @desc Flash the enemy who started cast
 * @default true
 * @type boolean
 *
 * @param soundWhenCastStarts
 * @text SE played when cast starts
 * @desc SE played when cast starts.
 * @type struct<sound>
 *
 * @param soundForZeroCastTime
 * @text SE for zero cast time
 * @desc Whether the SE should be played even for skills of zero cast time.
 * @type boolean
 * @default false
 * @on Play
 * @off Don’t play
 *
 * @param actorInterrupt
 * @text Interrupt Ally
 * @desc Message shown when an ally’s action got interrupted. %1 will be replaced with the target.
 * @default %1 was interrupted!
 * @type string
 *
 * @param enemyInterrupt
 * @text Interrupt Enemy
 * @desc Message shown when an enemy’s action got interrupted. %1 will be replaced with the target.
 * @default %1 was interrupted!
 * @type string
 *
 * @param interruptByDamage
 * @text Interrupt by damage
 * @desc Whether HP damage causes interrupt to skill in cast time
 * @default false
 * @type boolean
 */
/*~struct~sound:
 * @param name
 * @text File
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text Volume
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text Pitch
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text Balance
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

/*:ja
 * @target MZ
 * @plugindesc TPBに詠唱待ちを実装
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBCastTime.js
 *
 * @help TPBCastTime.js
 *
 * このプラグインは、バージョン1.0.0のTPBで正しく実装されていなかった
 * 詠唱（キャスト）待ちを実装します。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和2年9月26日 戦闘外でスキルを使うと落ちる問題を修正
 * 令和2年9月26日 戦闘行動の強制で止まる問題を修正
 *                コストの2度払いを抑止
 * 令和2年9月25日 初版
 *
 * @param flashWhenCastStarts
 * @text キャスト開始時に光らせる
 * @desc キャスト開始した敵を光らせます。
 * @default true
 * @type boolean
 *
 * @param soundWhenCastStarts
 * @text キャスト開始時の効果音
 * @desc キャスト開始時に鳴らす効果音です。
 * @type struct<sound>
 *
 * @param soundForZeroCastTime
 * @text 即時発動スキルの時
 * @desc 速度補正が0のスキルでもキャスト開始音を鳴らすかどうかを指定します。
 * @type boolean
 * @default false
 * @on 鳴らす
 * @off 鳴らさない
 *
 * @param actorInterrupt
 * @text 味方に行動妨害
 * @desc 味方の行動が妨害されたときに表示されるメッセージを指定します。%1は対象に変換されます。
 * @default %1は行動を妨害された！
 * @type string
 *
 * @param enemyInterrupt
 * @text 敵に行動妨害
 * @desc 敵の行動を妨害したときに表示されるメッセージを指定します。%1は対象に変換されます。
 * @default %1の行動を妨害した！
 * @type string
 *
 * @param interruptByDamage
 * @text ダメージを与えると行動妨害
 * @desc HPダメージを与えることで行動を妨害できるかを指定します。
 * @default false
 * @type boolean
 */
/*~struct~sound:ja
 * @param name
 * @text ファイル
 * @type file
 * @dir audio/se
 *
 * @param volume
 * @text 音量
 * @default 90
 * @type number
 * @min 0
 * @max 100
 *
 * @param pitch
 * @text ピッチ
 * @default 100
 * @type number
 * @min 50
 * @max 150
 *
 * @param pan
 * @text 位相
 * @default 0
 * @type number
 * @min -100
 * @max 100
 */

(() => {

	const pluginName = "TPBCastTime";
	const param = PluginManager.parameters(pluginName);

	const soundWhenCastStarts = (function(k) {
		k.volume = parseInt(k.volume);
		k.pitch = parseInt(k.pitch);
		k.pan = parseInt(k.pan);
		return k;
	})(JSON.parse(param.soundWhenCastStarts));

	const orig_Game_Action_clear = Game_Action.prototype.clear;
	Game_Action.prototype.clear = function() {
		orig_Game_Action_clear.call(this);
		this._deferredTarget = null;
		this._costPaid = false;
	};

	const orig_Game_Action_isValid = Game_Action.prototype.isValid;
	Game_Action.prototype.isValid = function() {
		return this._costPaid || orig_Game_Action_isValid.call(this);
	};

	const orig_Game_ActionResult_clear = Game_ActionResult.prototype.clear;
	Game_ActionResult.prototype.clear = function() {
		orig_Game_ActionResult_clear.call(this);
		this.interrupt = false;
	};

	const orig_Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		if ((!$gameParty._inBattle) || (!BattleManager.isTpb())) {
			orig_Game_Battler_useItem.call(this, item);
		} else if (this.currentAction()._forcing) {
			orig_Game_Battler_useItem.call(this, item);
			this._actions[0]._costPaid = true;
		} else if (this._tpbState === "acting") {
			if (BattleManager._action._deferredTarget) {
				BattleManager._targets = BattleManager._action._deferredTarget;
			} else if (BattleManager._action._targetIndex >= 0) {
				if (BattleManager._action.isForFriend()) {
					BattleManager._targets = [this.friendsUnit().members()[BattleManager._action._targetIndex]];
				} else {
					BattleManager._targets = [this.opponentsUnit().members()[BattleManager._action._targetIndex]];
				}
			}
			if (this._actions[0]._costPaid) {
				// to avoid cost duplicate...
				const mp = this._mp;
				const tp = this._tp;
				if (DataManager.isItem(item) && item.consumable) {
					$gameParty.gainItem(item, 1); // regain pre-consumed item
				}
				orig_Game_Battler_useItem.call(this, item);
				this._mp = mp;
				this._tp = tp;
			} else {
				orig_Game_Battler_useItem.call(this, item);
				this._actions[0]._costPaid = true;
			}
		} else {
			if (JSON.parse(param.flashWhenCastStarts)) {
				this.requestEffect("whiten");
			}
			if (soundWhenCastStarts.name) {
				if (JSON.parse(param.soundForZeroCastTime) || (this.tpbRequiredCastTime() > 0)) {
					AudioManager.playSe(soundWhenCastStarts);
				}
			}
			orig_Game_Battler_useItem.call(this, item);
			this._actions[0]._costPaid = true;
			this._actions[0]._deferredTarget = BattleManager._targets;
			this._actions.unshift(this._actions[0]);
			BattleManager._phase = "turn";
			BattleManager._action = null;
			BattleManager._targets = [];
		}
	};

	const orig_Game_Battler_onDamage = Game_Battler.prototype.onDamage;
	Game_Battler.prototype.onDamage = function(value) {
		orig_Game_Battler_onDamage.call(this, value);
		if (JSON.parse(param.interruptByDamage)) {
			this.interruptTpbCast();
		}
	};

	Game_BattlerBase.prototype.cancelTpbAction = function() {
		this._actionState = "done";
		this._tpbState = "charging";
		this._tpbTurnEnd = false;
		this._actions = [];
		this._tpbChargeTime = this._tpbCastTime = this._tpbIdleTime = 0;
		BattleManager._actionBattlers = BattleManager._actionBattlers.filter(b => (b !== this));
	};

	Game_BattlerBase.prototype.interruptTpbCast = function() {
		// Canceled if got restriction during cast time
		if (this._tpbState === "casting") {
			this.cancelTpbAction();
			this._result.interrupt = true;
		}
	};

	const orig_Game_BattlerBase_onRestrict = Game_BattlerBase.prototype.onRestrict;
	Game_BattlerBase.prototype.onRestrict = function() {
		// Canceled if got restriction during cast time
		this.interruptTpbCast();
		orig_Game_BattlerBase_onRestrict.call(this);
	};

	const orig_BattleManager_startAction = BattleManager.startAction;
	BattleManager.startAction = function() {
		try {
			orig_BattleManager_startAction.call(this);
		} catch (e) {
			if ((e instanceof TypeError) && (e.message == "Cannot read property 'applyGlobal' of null")) {
				// intended cancellation. nothing to do.
			} else {
				throw e;
			}
		}
	};

	const orig_BattleManager_processTurn = BattleManager.processTurn;
	BattleManager.processTurn = function() {
		if (!this.isTpb()) {
			orig_BattleManager_processTurn.call(this);
		} else if (this._subject.currentAction() && this._subject.currentAction()._forcing) {
			const nosOfActions = this._subject._actions.length;
			orig_BattleManager_processTurn.call(this);
			if (nosOfActions <= this._subject._actions.length) {
				this._subject.removeCurrentAction();
			}
		} else {
			if (this._actionBattlers.length) {
				if (this._subject) {
					this._actionBattlers.push(this._subject);
				}
				this._subject = this.getNextSubject();
			}
			if (this._subject) {
				if ((this._subject._tpbState !== "casting")
					|| (this._subject._actions.length == 0)
					|| (this._subject._actions[0]._deferredTarget === null)
				) {
					orig_BattleManager_processTurn.call(this);
				}
			}
			if (this._subject) {
				if (this._subject._tpbState === "casting") {
					this._actionBattlers.push(this._subject);
					this._subject = null;
				}
			}
		}
	};

	Window_BattleLog.prototype.displayInterrupt = function(target) {
		this._methods.pop(); // popBaseLine
		this.push("addText", param[target.isActor() ? "actorInterrupt" : "enemyInterrupt"].format(target.name()));
		this.push("waitForNewLine");
		this.push("popBaseLine");
	};

	const orig_Window_BattleLog_displayActionResults = Window_BattleLog.prototype.displayActionResults;
	Window_BattleLog.prototype.displayActionResults = function(subject, target) {
		orig_Window_BattleLog_displayActionResults.call(this, subject, target);
		if ((target.result().used) && (target.result().interrupt)) {
			this.displayInterrupt(target);
		}
	};

})();
