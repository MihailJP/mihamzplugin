//=============================================================================
// RPG Maker MZ - アクティブTPBで落ちる問題に対処
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Workaround that fixes crash issue with active TPB
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBWorkaround.js
 *
 * @help TPBWorkAround.js
 *
 * This plugin works around crash issue with active TPBS
 * which occurs on version 1.0.0. This is discussed at:
 * https://forums.rpgmakerweb.com/index.php?threads/bug-extremely-rare-but-fatal-active-tpbs-bug-crashing-the-game.126144/
 *
 * It does not provide plugin commands.
 *
 * License: The Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt
 *
 * 更新履歴
 * 24 Sept 2020: Update referencing the forum posts
 * 21 Sept 2020: First edition
 */

/*:ja
 * @target MZ
 * @plugindesc アクティブTPBで落ちる問題に対処
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/TPBWorkaround.js
 *
 * @help TPBWorkAround.js
 *
 * このプラグインは、Version 1.0.0 で発生している、
 * アクティブTPBで落ちる問題に対処します。海外版ツクールフォーラムを参照してください。
 * https://forums.rpgmakerweb.com/index.php?threads/bug-extremely-rare-but-fatal-active-tpbs-bug-crashing-the-game.126144/
 *
 * プラグインコマンドはありません。
 *
 * ライセンス: Unlicense
 * https://github.com/MihailJP/mihamzplugin/blob/master/LICENSE.txt
 *
 * 更新履歴
 * 令和2年9月24日 海外版フォーラムを参考に修正
 * 令和2年9月21日 初版
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
	const orig_Scene_Battle_onActorOk = Scene_Battle.prototype.onActorOk;
	Scene_Battle.prototype.onActorOk = function() {
		try {
			orig_Scene_Battle_onActorOk.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const orig_Scene_Battle_onSkillOk = Scene_Battle.prototype.onSkillOk;
	Scene_Battle.prototype.onSkillOk = function() {
		try {
			orig_Scene_Battle_onSkillOk.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const orig_Scene_Battle_onItemOk = Scene_Battle.prototype.onItemOk;
	Scene_Battle.prototype.onItemOk = function() {
		try {
			orig_Scene_Battle_onItemOk.call(this);
		} catch (e) {
			if (e instanceof TypeError) {
				console.log(e);
			} else {
				throw e;
			}
		}
	};
	const orig_Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
	Scene_Battle.prototype.onSelectAction = function() {
		try {
			orig_Scene_Battle_onSelectAction.call(this);
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
