//=============================================================================
// RPG Maker MZ - Include the target of item or skill in the message
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Include the target of item or skill in the message
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/ItemTargetInMessage.js
 * @orderAfter SpeakInBattle
 *
 * @help ItemTargetInMessage.js
 *
 * This plugin expands feature of the message shown when using items or skills.
 * Write %3 in the message to include the target's name.
 * If more than one target, the message could be redundant.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 23 Sept 2020: First edition.
 */

/*:ja
 * @target MZ
 * @plugindesc アイテムやスキルのターゲットをメッセージに入れられるようにする
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/ItemTargetInMessage.js
 *
 * @help ItemTargetInMessage.js
 *
 * このプラグインは、スキルやアイテムを使用したときのメッセージを拡張します。
 * スキルやアイテムのメッセージに %3 と書くことで対象の名前を含めることができます。
 * 対象が複数の場合はメッセージが冗長になります。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和2年9月23日 初版
 */
 
(() => {

	Window_BattleLog.prototype.displayItemMessage = function(fmt, subject, item) {
		if (fmt) {
			//this.push("addText", fmt.format(subject.name(), item.name));
			this.push("addText", fmt.format(subject.name(), item.name,
				BattleManager._targets.map(t => t.name()).join(
				Boolean($dataSystem.locale.match(/^ja[^[:alpha:]]?/)) ? "、" : ",")));
		}
	};

})();
