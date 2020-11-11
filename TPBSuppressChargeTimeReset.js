//=============================================================================
// RPG Maker MZ - Do not reset TPB charge time between turns
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Do not reset TPB charge time between turns
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBSuppressChargeTimeReset.js
 *
 * @help TPBSuppressChargeTimeReset.js
 *
 * This plugin suppresses unrequired reset of TPB charge time
 * when a turn ends.
 *
 * WARNING: This affects game balance, especially with the active TPB system!
 *
 * It does not provide plugin commands.
 *
 * License: The Unlicense
 *
 * Changelog
 * 12 Nov 2020: First edition.
 */

/*:ja
 * @target MZ
 * @plugindesc TPBでターン間のチャージ時間リセットを抑制する
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBSuppressChargeTimeReset.js
 *
 * @help TPBSuppressChargeTimeReset.js
 *
 * このプラグインは、ターン終了時に起きる不必要なチャージ時間の
 * リセットを抑止します。
 * 
 * 【警告】特にアクティブTPBの場合、ゲームバランスに影響します。
 *
 * プラグインコマンドはありません。
 *
 * ライセンス: Unlicense
 *
 * 更新履歴
 * 令和2年11月12日 初版
 */

(() => {

	const orig_BattleManager_endBattlerActions = BattleManager.endBattlerActions;
	BattleManager.endBattlerActions = function(battler) {
		const origTpbState = battler._tpbState;
		const origTpbChargeTime = battler._tpbChargeTime;
		orig_BattleManager_endBattlerActions.call(this, battler);
		if (this.isTpb()) {
			if (origTpbState == "charging") {
				battler._tpbChargeTime = origTpbChargeTime;
			}
		}
	};

})();
