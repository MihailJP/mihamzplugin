//=============================================================================
// RPG Maker MZ - Switches to let enemy characters do a specific action
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Switches to let enemy characters do a specific action
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/EnemySpecialActionSwitch.js
 *
 * @help EnemySpecialActionSwitch.js
 *
 * This plugin implements switches to let enemy characters do a specific action.
 * They are updated each time before an action (regardless of an enemy or an ally).
 *
 * It does not provide plugin commands.
 *
 * @param switchList
 * @text List of switches
 * @desc List of switches corresponding conditions.
 * @default []
 * @type struct<ConditionSwitch>[]
 *
 */
/*~struct~ConditionSwitch:
 *
 * @param switchId
 * @text Switch
 * @desc Specify a switch to be paired with a condition.
 * @type switch
 *
 * @param condition
 * @text Condition
 * @desc Specify a Javascript code to be paired with a switch. The code must be evaluated to boolean.
 * @type string
 *
 */

/*:ja
 * @target MZ
 * @plugindesc 敵キャラクターに特定の行動を取らせるスイッチ
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/EnemySpecialActionSwitch.js
 *
 * @help EnemySpecialActionSwitch.js
 *
 * このプラグインは、敵キャラクターに特定の行動を取らせるスイッチを実装します。
 * （敵味方関係なく）行動の前に更新されます。
 *
 * プラグインコマンドはありません。
 *
 * @param switchList
 * @text スイッチリスト
 * @desc 条件に対応付けられたスイッチのリストです。
 * @default []
 * @type struct<ConditionSwitch>[]
 *
 */
/*~struct~ConditionSwitch:ja
 *
 * @param switchId
 * @text スイッチ
 * @desc 条件に対応させるスイッチを指定します。
 * @type switch
 *
 * @param condition
 * @text 条件
 * @desc スイッチに対応させる条件をJavascriptのコードで指定します。
 * @type string
 *
 */
 
(() => {
    const pluginName = "EnemySpecialActionSwitch";
	const param = PluginManager.parameters(pluginName);
	const switches = JSON.parse(param.switchList)
		.map(sw => JSON.parse(sw))
		.map(sw => {sw.switchId = parseInt(sw.switchId); return sw;});

	const updateSwitches = function() {
		switches.forEach(sw => $gameSwitches.setValue(sw.switchId, Boolean(eval(sw.condition))));
	};
	
	const orig_Game_Battler_makeActions = Game_Battler.prototype.makeActions;
	Game_Battler.prototype.makeActions = function() {
		updateSwitches();
		orig_Game_Battler_makeActions.call(this);
	};
})();
