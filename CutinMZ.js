//=============================================================================
// RPG Maker MZ - Implement cut-in picture for skills
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Cut-in picture when using a skill or an item
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/CutinMZ.js
 * @orderBefore AltSkillByTarget
 * @orderBefore TPBCastTime
 *
 * @help CutinMZ.js
 *
 * This plugin implements cut-in pictures shown when using a skill or an item.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 15 Nov 2020: First edition.
 * 18 Jul 2021: Fix crash issue caused by certain setting
 *
 * @param cutInList
 * @text Cut-in list
 * @desc Define cut-ins.
 * @type struct<cutin>[]
 */
/*~struct~cutin:
 * @param actors
 * @text Actors
 * @desc Show it if one of specified actors. If both actors and enemies are empty, any battler.
 * @type actor[]
 * @default []
 *
 * @param enemies
 * @text Enemies
 * @desc Show it if one of specified enemies. If both actors and enemies are empty, any battler.
 * @type enemy[]
 * @default []
 *
 * @param skills
 * @text Skills
 * @desc Show it if one of specified skills. If both skills and items are empty, any action.
 * @type skill[]
 * @default []
 *
 * @param items
 * @text Items
 * @desc Show it if one of specified items. If both skills and items are empty, any action.
 * @type item[]
 * @default []
 *
 * @param file
 * @text File
 * @type file
 * @desc File of cut-in picture.
 * @dir img/pictures
 *
 * @param offsetX
 * @text X offset from the center
 * @desc Specify the picture origin by offset of the center.
 * @type number
 * @default 0
 * @min -32768
 * @max 32767
 *
 * @param offsetY
 * @text Y offset from the center
 * @desc Specify the picture origin by offset of the center.
 * @type number
 * @default 0
 * @min -32768
 * @max 32767
 *
 * @param scaleX
 * @text X scale factor
 * @desc Specify the rate of magnification of the picture, by percentage.
 * @type number
 * @default 100
 * @min -32768
 * @max 32767
 *
 * @param scaleY
 * @text Y scale factor
 * @desc Specify the rate of magnification of the picture, by percentage.
 * @type number
 * @default 100
 * @min -32768
 * @max 32767
 *
 * @param opacity
 * @text Opacity
 * @desc Opacity of the cut-in. (0 = invisible, 255 = opaque)
 * @type number
 * @default 255
 * @min 0
 * @max 255
 *
 * @param animationType
 * @text Easing
 * @desc Type of easing animation.
 * @type select
 * @default 0
 * @option Float-in/out, right to left
 * @value 0
 * @option Float-in/out, left to right
 * @value 1
 * @option Float-in/out, bottom to top
 * @value 2
 * @option Float-in/out, top to bottom
 * @value 3
 * @option Zoom-out
 * @value 4
 * @option Zoom-in
 * @value 5
 */

/*:ja
 * @target MZ
 * @plugindesc スキル使用時のカットイン
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/CutinMZ.js
 * @orderBefore AltSkillByTarget
 * @orderBefore TPBCastTime
 *
 * @help CutinMZ.js
 *
 * このプラグインは、スキルやアイテム使用時のカットインを実装します。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和2年11月15日 初版
 * 令和3年7月18日 設定によって落ちるバグを修正
 *
 * @param cutInList
 * @text カットインリスト
 * @desc カットインの内容を定義します。
 * @type struct<cutin>[]
 */
/*~struct~cutin:ja
 * @param actors
 * @text 対象アクター
 * @desc 使用者が指定したアクターの時に表示されます。アクター、エネミーとも空の時は全バトラーが対象となります。
 * @type actor[]
 * @default []
 *
 * @param enemies
 * @text 対象エネミー
 * @desc 使用者が指定したエネミーの時に表示されます。アクター、エネミーとも空の時は全バトラーが対象となります。
 * @type enemy[]
 * @default []
 *
 * @param skills
 * @text 対象スキル
 * @desc 行動が指定したスキルの時に表示されます。スキル、アイテムとも空の時は全行動が対象となります。
 * @type skill[]
 * @default []
 *
 * @param items
 * @text 対象アイテム
 * @desc 行動が指定したアイテムの時に表示されます。スキル、アイテムとも空の時は全行動が対象となります。
 * @type item[]
 * @default []
 *
 * @param file
 * @text ファイル
 * @desc カットインの画像ファイルです。
 * @type file
 * @dir img/pictures
 *
 * @param offsetX
 * @text 中央からのXオフセット
 * @desc 画像の原点を中心からのオフセットで指定します。
 * @type number
 * @default 0
 * @min -32768
 * @max 32767
 *
 * @param offsetY
 * @text 中央からのYオフセット
 * @desc 画像の原点を中心からのオフセットで指定します。
 * @type number
 * @default 0
 * @min -32768
 * @max 32767
 *
 * @param scaleX
 * @text X拡大率
 * @desc 画像の拡大率を%単位で指定します。
 * @type number
 * @default 100
 * @min -32768
 * @max 32767
 *
 * @param scaleY
 * @text Y拡大率
 * @desc 画像の拡大率を%単位で指定します。
 * @type number
 * @default 100
 * @min -32768
 * @max 32767
 *
 * @param opacity
 * @text 不透明度
 * @desc 画像の不透明度を%単位で指定します。(0 = 不可視、255 = 不透明)
 * @type number
 * @default 255
 * @min 0
 * @max 255
 *
 * @param animationType
 * @text アニメーションの種類
 * @desc カットイン表示時のアニメーションを指定します。
 * @type select
 * @default 0
 * @option フロートインアウト（右から左）
 * @value 0
 * @option フロートインアウト（左から右）
 * @value 1
 * @option フロートインアウト（下から上）
 * @value 2
 * @option フロートインアウト（上から下）
 * @value 3
 * @option ズームアウト
 * @value 4
 * @option ズームイン
 * @value 5
 */

(() => {

	const pluginName = "CutinMZ";
	const param = PluginManager.parameters(pluginName);
	const cutInList = JSON.parse(param.cutInList).map(x => JSON.parse(x))
		.map(function(item) {
			item.offsetX = parseInt(item.offsetX);
			item.offsetY = parseInt(item.offsetY);
			item.scaleX = parseInt(item.scaleX);
			item.scaleY = parseInt(item.scaleY);
			item.opacity = parseInt(item.opacity);
			item.animationType = parseInt(item.animationType);
			item.actors = JSON.parse(item.actors).map(id => parseInt(id));
			item.enemies = JSON.parse(item.enemies).map(id => parseInt(id));
			item.skills = JSON.parse(item.skills).map(id => parseInt(id));
			item.items = JSON.parse(item.items).map(id => parseInt(id));
			return item;
		});

	console.log(cutInList);

	const orig_Scene_Battle_create = Scene_Battle.prototype.create;
	Scene_Battle.prototype.create = function() {
		orig_Scene_Battle_create.call(this);
		this._cutInImage = new Sprite();
		this._cutInImage.offsetX = 0;
		this._cutInImage.offsetY = 0;
		this._cutInImage.baseScaleX = 1;
		this._cutInImage.baseScaleY = 1;
		this._cutInImage.baseX = function() {
			return ($dataSystem.advanced.screenWidth - this.width * this.scale.x) / 2 - this.offsetX * this.scale.x;
		};
		this._cutInImage.baseY = function() {
			return ($dataSystem.advanced.screenHeight - this.height * this.scale.y) / 2 - this.offsetY * this.scale.y;
		};
		this._cutInImage.baseOpacity = 255;
		this._cutInImage._baseFrame = 0;
		this._cutInImage.animationFrame = function() { return Graphics.frameCount - this._baseFrame; };
		this._cutInImage.animationType = 0;
	};

	const orig_Scene_Battle_start = Scene_Battle.prototype.start
	Scene_Battle.prototype.start = function() {
		orig_Scene_Battle_start.call(this);
		this.addChild(this._cutInImage);
	};

	const orig_Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		const findBattler = function(b, c) {
			if (c.actors.length == 0 && c.enemies.length == 0) {
				return true;
			} else if (b.isActor() && c.actors.includes(b.actorId())) {
				return true;
			} else if (b.isEnemy() && c.enemies.includes(b.enemyId())) {
				return true;
			} else {
				return false;
			}
		};
		const findItem = function(i, c) {
			if (c.skills.length == 0 && c.items.length == 0) {
				return true;
			} else if (DataManager.isSkill(i) && c.skills.includes(i.id)) {
				return true;
			} else if (DataManager.isItem(i) && c.items.includes(i.id)) {
				return true;
			} else {
				return false;
			}
		};
		const sprite = SceneManager._scene._cutInImage;
		const cutIn = cutInList.filter(ci => findBattler(this, ci)).filter(ci => findItem(item, ci))[0];
		if (cutIn && sprite) {
			sprite.bitmap = ImageManager.loadPicture(cutIn.file);
			sprite.baseScaleX = cutIn.scaleX / 100;
			sprite.baseScaleY = cutIn.scaleY / 100;
			sprite.offsetX = cutIn.offsetX;
			sprite.offsetY = cutIn.offsetY;
			sprite._baseFrame = Graphics.frameCount;
			sprite.animationType = cutIn.animationType;
		}
		orig_Game_Battler_useItem.call(this, item);
	};

	const animationData = function(animationType, frameCount) {
		const floatInOutOffset = function(fc) {
			if (fc < 15) {
				return Math.round((15 - fc) * (15 - fc) / 3);
			} else if (fc >= 30) {
				return -Math.round((fc - 30) * (fc - 30) / 3);
			} else {
				return 0;
			}
		};
		const floatInOutOpacity = function(fc) {
			if (fc < 15) {
				return 255 * fc / 15;
			} else if (fc >= 45) {
				return 0;
			} else if (fc >= 30) {
				return 255 * (45 - fc) / 15;
			} else {
				return 255;
			}
		};
		const zoomOutScale = function(fc) {
			if (fc < 15) {
				return 1 + (15 - fc) * (15 - fc) / 225 * 0.15;
			} else if (fc >= 30) {
				return 1 - (fc - 30) * (fc - 30) / 225 * 0.15;
			} else {
				return 1;
			}
		};
		const zoomInScale = function(fc) {
			if (fc < 15) {
				return 1 - (15 - fc) * (15 - fc) / 225 * 0.15;
			} else if (fc >= 30) {
				return 1 + (fc - 30) * (fc - 30) / 225 * 0.15;
			} else {
				return 1;
			}
		};
		switch (animationType) {
			case 0: // 右から左
				return (frameCount >= 45) ? null :
					{ x: floatInOutOffset(frameCount), y: 0, scale: 1, opacity: floatInOutOpacity(frameCount) };
			case 1: // 左から右
				return (frameCount >= 45) ? null :
					{ x: -floatInOutOffset(frameCount), y: 0, scale: 1, opacity: floatInOutOpacity(frameCount) };
			case 2: // 下から上
				return (frameCount >= 45) ? null :
					{ x: 0, y: floatInOutOffset(frameCount), scale: 1, opacity: floatInOutOpacity(frameCount) };
			case 3: // 上から下
				return (frameCount >= 45) ? null :
					{ x: 0, y: -floatInOutOffset(frameCount), scale: 1, opacity: floatInOutOpacity(frameCount) };
			case 4: // ズームアウト
				return (frameCount >= 45) ? null :
					{ x: 0, y: 0, scale: zoomOutScale(frameCount), opacity: floatInOutOpacity(frameCount) };
			case 5: // ズームイン
				return (frameCount >= 45) ? null :
					{ x: 0, y: 0, scale: zoomInScale(frameCount), opacity: floatInOutOpacity(frameCount) };
			default:
				return null;
		}
	};

	const updateCutIn = function() {
		const sprite = SceneManager._scene._cutInImage;
		if (sprite.bitmap) {
			const anim = animationData(sprite.animationType, sprite.animationFrame());
			if (anim) {
				sprite.scale.x = sprite.baseScaleX * anim.scale;
				sprite.scale.y = sprite.baseScaleY * anim.scale;
				sprite.x = sprite.baseX() + anim.x;
				sprite.y = sprite.baseY() + anim.y;
				sprite.opacity = sprite.baseOpacity * anim.opacity / 255;
			} else {
				sprite.bitmap = undefined;
			}
		}
	};

	const orig_Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		updateCutIn();
		orig_Scene_Battle_update.call(this);
	};

})();
