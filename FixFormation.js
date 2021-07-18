//=============================================================================
// RPG Maker MZ - Prevents some actors' formation from being changed
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Prevents some actors' formation from being changed
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/FixFormation.js
 *
 * @help FixFormation.js
 *
 * This plugin prevents some actors' formation from being changed.
 * If there is <noFormationChange> in the memo of an actor,
 * that character is excluded from changing formation.
 * Actors with given state are also excluded from changing formation
 * until that state is removed.
 *
 * It does not provide plugin commands.
 *
 * Changelog
 * 19 Jul 2021: First edition.
 *
 * @param stateId
 * @text State
 * @desc Actors with this state are excluded from changing formation.
 * @type state
 */

/*:ja
 * @target MZ
 * @plugindesc 特定のアクターの並び替えを禁止する
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/FixFormation.js
 *
 * @help FixFormation.js
 *
 * このプラグインは、特定のアクターの並び替えを禁止します。
 * アクターのメモ欄に <noFormationChange> と書かれている場合、
 * そのキャラクターは並び替えができなくなります。
 * また、指定されたステートが付与されているアクターは、
 * ステートが解除されるまで並び替えができません。
 *
 * プラグインコマンドはありません。
 *
 * 更新履歴
 * 令和3年7月19日 初版
 *
 * @param stateId
 * @text ステート
 * @desc このステートが付加されたアクターは、並び替えができなくなります。
 * @type state
 */

(() => {

	const pluginName = "FixFormation";
	const param = PluginManager.parameters(pluginName);
	const stateId = parseInt(param.stateId);

	const orig_Game_Actor_isFormationChangeOk = Game_Actor.prototype.isFormationChangeOk;
	Game_Actor.prototype.isFormationChangeOk = function() {
		if((stateId > 0) && this.isStateAffected(stateId)) {
			return false;
		}
		else if (this.isActor() && $dataActors[this._actorId].meta.noFormationChange) {
			return false;
		}
		else {
			return true;
		}
	};

})();
