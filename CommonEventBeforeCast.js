//=============================================================================
// RPG Maker MZ - Run a common event just before skill/item cast time
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Run a common event just before skill/item cast time
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/CommonEventBeforeCast.js
 * @orderBefore AltSkillByTarget
 *
 * @help CommonEventBeforeCast.js
 *
 * This plugin calls given common event just before the beginning
 * of cast time of a skill or an item which is used in battle.
 * If there is <ceBeforeCast:X> (where X is the common event number)
 * at the memo of a skill or an item, given common event will be called
 * when such skill or item is used in battle.
 * Ignored if out of battle.
 *
 * It does not provide plugin commands.
 *
 * License: The Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt
 *
 * Changelog
 * 24 Sept 2020: First edition.
 */

/*:ja
 * @target MZ
 * @plugindesc スキル・アイテムのキャスト開始時にコモンイベントを起動
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/CommonEventBeforeCast.js
 * @orderBefore AltSkillByTarget
 *
 * @help CommonEventBeforeCast.js
 *
 * このプラグインは、戦闘中にスキルやアイテムを使用したとき、
 * キャスト開始時にコモンイベントを呼び出します。
 * スキルやアイテムのメモ欄に <ceBeforeCast:X> （Xはコモンイベントの番号）を記入すると、
 * 戦闘中にそのスキルを使用したときにコモンイベントが実行されます。
 * 戦闘以外では無視されます。
 *
 * プラグインコマンドはありません。
 *
 * ライセンス: Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt
 *
 * 更新履歴
 * 令和2年9月24日 初版
 */
 
(() => {

	const orig_Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		const commonEventNumber = parseInt(item.meta.ceBeforeCast)
		if (commonEventNumber && $gameTroop.inBattle()) {
			$gameTemp._commonEventQueue.unshift(commonEventNumber);
			$gameTroop._interpreter.setupReservedCommonEvent();
			$gameTroop.updateInterpreter();
		}
		orig_Game_Battler_useItem.call(this, item);
	};

})();
