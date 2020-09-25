//=============================================================================
// RPG Maker MZ - Change timer display
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Change timer display
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TimerText.js
 *
 * @help TimerText.js
 *
 * This plugin changes how to display the timer.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 25 Sept 2020: Boolean options were not applied.
 * 23 Sept 2020: First edition.
 *
 * @param bitmapWidth
 * @text Width of display area
 * @desc Changes width of display area. Set 0 for default.
 * @default 96
 * @type number
 * @min 0
 *
 * @param bitmapHeight
 * @text Height of display area
 * @desc Changes height of display area. Set 0 for default.
 * @default 48
 * @type number
 * @min 0
 *
 * @param forceFixedPitch
 * @text Fixed pitch
 * @desc Forces fixed pitch.
 * @default false
 * @type boolean
 *
 * @param blinkColon
 * @text Blink ":"
 * @desc Blink ":".
 * @default false
 * @type boolean
 *
 */

/*:ja
 * @target MZ
 * @plugindesc タイマーの表示を変更
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TimerText.js
 *
 * @help TimerText.js
 *
 * このプラグインは、タイマーの表示方法を変更します。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和2年9月25日 booleanオプションが反映されていないのを修正
 * 令和2年9月23日 初版
 *
 * @param bitmapWidth
 * @text 表示領域の幅
 * @desc 表示領域の幅を変更します。0の時はデフォルト値になります。
 * @default 96
 * @type number
 * @min 0
 *
 * @param bitmapHeight
 * @text 表示領域の高さ
 * @desc 表示領域の高さを変更します。0の時はデフォルト値になります。
 * @default 48
 * @type number
 * @min 0
 *
 * @param forceFixedPitch
 * @text 固定ピッチにする
 * @desc 数字の幅を強制的に揃えます。
 * @default false
 * @type boolean
 *
 * @param blinkColon
 * @text 「：」を点滅させる
 * @desc 「：」を点滅させます。
 * @default false
 * @type boolean
 *
 */
 
(() => {
    const pluginName = "TimerText";
	const param = PluginManager.parameters(pluginName);

	// rmmz_sprites.js
	Sprite_Timer.prototype.createBitmap = function() {
		//this.bitmap = new Bitmap(96, 48);
		// ↓ Added by MihailJP
		this.bitmap = new Bitmap(param.bitmapWidth || 96, param.bitmapHeight || 48);
		// ↑ Added by MihailJP
		this.bitmap.fontFace = this.fontFace();
		this.bitmap.fontSize = this.fontSize();
		this.bitmap.outlineColor = ColorManager.outlineColor();
	};
	Sprite_Timer.prototype.redraw = function() {
		const text = this.timerText();
		//const width = this.bitmap.width;
		// ↓ Added by MihailJP
		const width = this.bitmap.width / (JSON.parse(param.forceFixedPitch) ? text.length : 1);
		// ↑ Added by MihailJP
		const height = this.bitmap.height;
		this.text = text;
		this.bitmap.clear();
		// ↓ Added by MihailJP
		if (JSON.parse(param.forceFixedPitch)) {
			for (let i = 0; i < text.length; ++i) {
				this.bitmap.drawText(text.substr(i, 1), width * i, 0, width, height, "center");
			}
		} else {
		// ↑ Added by MihailJP
			this.bitmap.drawText(text, 0, 0, width, height, "center");
		// ↓ Added by MihailJP
		}
		// ↑ Added by MihailJP
	};

	const orig_Sprite_Timer_updateBitmap = Sprite_Timer.prototype.updateBitmap;
	Sprite_Timer.prototype.updateBitmap = function() {
		orig_Sprite_Timer_updateBitmap.call(this);
		if (this.text !== this.timerText()) {
			this.redraw();
		}
	};

	const orig_Sprite_Timer_timerText = Sprite_Timer.prototype.timerText;
	Sprite_Timer.prototype.timerText = function() {
		return orig_Sprite_Timer_timerText.call(this).replace(/:/,
			((!JSON.parse(param.blinkColon)) || ($gameTimer._frames < 1) || ($gameTimer._frames % 60 >= 30))
			? ":" : " ");
	};

})();
