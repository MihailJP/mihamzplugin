//=============================================================================
// RPG Maker MZ - Alternative skill for specific targets
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Alternative skill for specific targets
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/AltSkillByTarget.js
 * @orderAfter SpeakInBattle
 *
 * @help AltSkillByTarget.js
 *
 * This plugin implements that using alternative skill to specific target.
 * If there is <altSkill:x> (where x is a nonzero number) at the memo of an
 * actor or an enemy character, and there is <altSkillX:Y> (where X is a
 * nonzero number and Y is skill number) at the memo of a skill, the skill
 * of given number will be used instead when the target has corresponding
 * altSkill number.
 *
 * Single-target skills only.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 22 Sept 2020: First edition
 */

/*:ja
 * @target MZ
 * @plugindesc 特定の対象には別のスキルを使う
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/AltSkillByTarget.js
 * @orderAfter SpeakInBattle
 *
 * @help AltSkillByTarget.js
 *
 * このプラグインは、「特定の対象に特定のスキルを使用した場合に別のスキルで
 * 代替する」ということを実装します。
 * アクターまたは敵キャラのメモ欄に <altSkill:〇> （0以外の数）と書き、
 * スキルのメモ欄に <altSkill〇:スキル番号> と書くことで、対応する番号の
 * altSkill を持つバトラーにスキルを使用したときに、代わりに指定したスキルが
 * 使用されるようになります。
 *
 * 対象が1人だけのスキルにのみ有効です。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和2年9月22日 初版
 */
 
(() => {
	const pluginName = "AltSkillByTarget";
	const param = PluginManager.parameters(pluginName);

	const orig_Game_Battler_useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(item) {
		if (BattleManager._targets.length == 1) {
			const target = BattleManager._targets[0];
			const targetData = target.isActor() ? $dataActors[target._actorId] : $dataEnemies[target._enemyId];
			const altSkillType = parseInt(targetData.meta.altSkill);
			const action = this._actions[0];
			if ((action._item.isSkill()) && Boolean(altSkillType)) {
				const altSkillId = parseInt($dataSkills[action._item._itemId].meta["altSkill" + altSkillType.toString()]);
				if (altSkillId) {
					action._item._itemId = altSkillId;
					orig_Game_Battler_useItem.call(this, action.item());
					return;
				}
			}
		}
		orig_Game_Battler_useItem.call(this, item);
	}

})();
