//=============================================================================
// RPG Maker MZ - Scene_Battle.onEnemyOk()等で落ちる問題に対処
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Workaround that fixes crash at Scene_Battle.onEnemyOk() etc. when TPB
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBWorkaround.js
 *
 * @help TPBWorkAround.js
 *
 * This plugin works around crash issue at following functions when TPB
 * which occurs on version 1.0.0:
 *
 * - Scene_Battle.prototype.onEnemyOk()
 * - Scene_Battle.prototype.commandAttack()
 * - Scene_Battle.prototype.commandGuard()
 *
 * It does not provide plugin commands.
 */

/*:ja
 * @target MZ
 * @plugindesc TPBでScene_Battle.onEnemyOk()等で落ちる問題に対処
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBWorkaround.js
 *
 * @help TPBWorkAround.js
 *
 * このプラグインは、Version 1.0.0 で発生している、
 * TPBの時に以下の関数で落ちる問題に対処します。
 *
 * - Scene_Battle.prototype.onEnemyOk()
 * - Scene_Battle.prototype.commandAttack()
 * - Scene_Battle.prototype.commandGuard()
 *
 * プラグインコマンドはありません。
 */

(() => {
	const orig_Scene_Battle_onEnemyOk = Scene_Battle.prototype.onEnemyOk;
	Scene_Battle.prototype.onEnemyOk = function() {
		try {
			orig_Scene_Battle_onEnemyOk.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const orig_Scene_Battle_commandAttack = Scene_Battle.prototype.commandAttack;
	Scene_Battle.prototype.commandAttack = function() {
		try {
			orig_Scene_Battle_commandAttack.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const orig_Scene_Battle_commandGuard = Scene_Battle.prototype.commandGuard;
	Scene_Battle.prototype.commandGuard = function() {
		try {
			orig_Scene_Battle_commandGuard.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
})();
