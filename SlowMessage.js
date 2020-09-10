//=============================================================================
// RPG Maker MZ - メッセージの表示をゆっくりにする
//=============================================================================

/*:en
 * @target MZ
 * @plugindesc Slows down message speed.
 * @author MihailJP
 *
 * @help SlowMessage.js
 *
 * Slows down the message speed.
 * Still can be skipped with the button except explicit wait.
 *
 * Set wait with the plugin command `setMessageWait`.
 *
 * @command setMessageWait
 * @text Set message wait
 * @desc Set wait for each letter [in frames].
 *
 * @arg wait
 * @type int
 * @text Wait
 * @desc Each time a letter displayed, waits by the time specified here.
 */

/*:ja
 * @target MZ
 * @plugindesc メッセージの表示をゆっくりにする
 * @author MihailJP
 *
 * @help SlowMessage.js
 *
 * メッセージの表示速度をゆっくりにします。
 * 明示的なウェイトがない限り、ボタンでスキップされます。
 *
 * プラグインコマンド setMessageWait を使用してウェイトを設定します。
 *
 * @command setMessageWait
 * @text メッセージのウェイト設定
 * @desc 文字表示ごとのウェイトをフレーム単位で設定します。
 *
 * @arg wait
 * @type int
 * @text ウェイト
 * @desc 1文字表示するごとにここで指定した長さのウェイトを入れます。
 */

(() => {
    const pluginName = "SlowMessage";
	let waitPerCharacter = 0;
	let tmpPos = NaN;

	const orig_Window_Message_initMembers
		= Window_Message.prototype.initMembers;
	Window_Message.prototype.initMembers = function() {
		orig_Window_Message_initMembers.call(this);
		waitPerCharacter = waitPerCharacter;
	};
	
	const orig_Window_Message_clearFlags
		= Window_Message.prototype.clearFlags;
	Window_Message.prototype.clearFlags = function() {
		orig_Window_Message_clearFlags.call(this);
		this._waitSkippable = false;
	};

	const orig_Window_Message_updateWait
		= Window_Message.prototype.updateWait;
	Window_Message.prototype.updateWait = function() {
		const result = orig_Window_Message_updateWait.call(this);
		if (waitPerCharacter > 0) {
			
			if (this._waitSkippable) {
				try {
					if (tmpPos == this._textState.x) {
						this._waitCount = 0;
					}
				} catch (e) {
					if (e instanceof TypeError) {
						tmpPos = NaN;
					} else {
						throw e;
					}
				}
			}
			if (this._waitCount <= 0) {
				this._waitSkippable = false;
			}
			if (this.isTriggered() && this._waitSkippable) {
				this._waitSkippable = false;
				this._waitCount = 0;
				return false;
			}
		}
		return result;
	};

	const orig_Window_Message_shouldBreakHere
		= Window_Message.prototype.shouldBreakHere;
	Window_Message.prototype.shouldBreakHere = function(textState) {
		const result = orig_Window_Message_shouldBreakHere.call(this, textState);
		if ((waitPerCharacter > 0) && result && !this._showFast && !this._lineShowFast
			&& (this._waitCount <= 0))
		{
			this._waitCount = waitPerCharacter;
			this._waitSkippable = true;
			tmpPos = this._textState.x;
		}
		return result;
	};

    PluginManager.registerCommand(pluginName, "setMessageWait", args => {
		const waitFrames = parseInt(args.wait);
		if (waitFrames > 0) {
			waitPerCharacter = waitFrames;
		} else {
			waitPerCharacter = 0;
		}
    });
})();
