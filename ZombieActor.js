//=============================================================================
// RPG Maker MZ - Zombification of dead actors
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Zombification of dead actors
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/ZombieActor.js
 *
 * @help ZombieActor.js
 *
 * This plugin implements that "dead" actors attack their allies
 * like zombie films.
 * If there is <zombifiable> in the memo of an actor, given state
 * is added instead of death.
 * Restriction of that state has its meaning:
 * - If "None", auto battle forced, enemies and allies are swapped for him/her.
 *   This will be a "smart zombie".
 * - If "Attack an Enemy" or "Attack Anyone", a berserker rather than a zombie.
 * - If "Attack an Ally", just literally. This will be a "classic zombie".
 * - If "Cannot Move", not an undead.
 *
 * It does not provide plugin commands.
 *
 * License: The Unlicense
 *
 * Changelog
 * 23 Sept 2020: Set parameter type
 * 22 Sept 2020: First edition
 *
 * @param alternativeDeathState
 * @text Alternative state number for death
 * @desc The state which will be added to dead (i.e. "zombified") actor instead of #1.
 * @type state
 *
 */

/*:ja
 * @target MZ
 * @plugindesc 戦闘不能アクターのゾンビ化
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/ZombieActor.js
 *
 * @help ZombieActor.js
 *
 * このプラグインは、「戦闘不能になるとゾンビ映画のように味方を襲いだす」
 * ということを実装します。
 * アクターのメモ欄に <zombifiable> と書かれている場合、戦闘不能になる代わりに
 * 指定したステートが付与されます。
 * 指定したステートの行動制約は意味を持ちます。
 * - 「なし」の場合は自動行動になり、敵と味方が入れ替わります。「賢いゾンビ」的なものです。
 * - 「敵を攻撃」「誰かを攻撃」の場合は、ゾンビというよりバーサーカーでしょう。
 * - 「味方を攻撃」は文字通りです。「古典的なゾンビ」と言えるものです。
 * - 「行動できない」の場合はアンデッドと呼びません。
 *
 * プラグインコマンドはありません。
 *
 * ライセンス: Unlicense
 *
 * 更新履歴
 * 令和2年9月23日 パラメータの型を設定
 * 令和2年9月22日 初版
 *
 * @param alternativeDeathState
 * @text 死亡時ステート番号
 * @desc 戦闘不能になったアクターに、ステート番号1番の代わりに付与するステートを指定します。
 * @type state
 *
 */
 
(() => {
	const pluginName = "ZombieActor";
	const param = PluginManager.parameters(pluginName);
	const alternativeDeathState = parseInt(param.alternativeDeathState);

	// rmmz_objects.js
	const orig_Game_BattlerBase_isDeathStateAffected = Game_BattlerBase.prototype.isDeathStateAffected;
	Game_BattlerBase.prototype.isDeathStateAffected = function() {
		return orig_Game_BattlerBase_isDeathStateAffected.call(this)
			|| this.isStateAffected(alternativeDeathState);
	};

	const orig_Game_BattlerBase_addNewState = Game_BattlerBase.prototype.addNewState;
	Game_BattlerBase.prototype.addNewState = function(stateId) {
		if (stateId === alternativeDeathState) {
			this.die();
		}
		orig_Game_BattlerBase_addNewState.call(this, stateId);
	};

	const orig_Game_Battler_refresh = Game_Battler.prototype.refresh;
	Game_Battler.prototype.refresh = function() {
		if (this.isActor() && $dataActors[this._actorId].meta.zombifiable) {
			Game_BattlerBase.prototype.refresh.call(this);
			if (this.hp === 0) {
				this.addState(alternativeDeathState);
			} else {
				this.removeState(alternativeDeathState);
			}
		} else {
			orig_Game_Battler_refresh.call(this);
		}
	};

	const orig_Game_Battler_removeState = Game_Battler.prototype.removeState;
	Game_Battler.prototype.removeState = function(stateId) {
		if (this.isStateAffected(stateId)) {
			if (stateId === alternativeDeathState) {
				this.revive();
			}
		}
		orig_Game_Battler_removeState.call(this, stateId);
	};

	const orig_Game_BattlerBase_isAutoBattle = Game_BattlerBase.prototype.isAutoBattle;
	Game_BattlerBase.prototype.isAutoBattle = function() {
		return orig_Game_BattlerBase_isAutoBattle.call(this)
			|| this.isSmartZombie(); // for smart zombies
	};

	Game_BattlerBase.prototype.isZombie = function() {
		return this.isAppeared() && this.isStateAffected(alternativeDeathState);
	};

	Game_BattlerBase.prototype.isSmartZombie = function() {
		return this.isZombie() && !this.isRestricted();
	};

	const orig_Game_Actor_friendsUnit = Game_Actor.prototype.friendsUnit;
	Game_Actor.prototype.friendsUnit = function() {
		if (this.isSmartZombie()) {
			return $gameTroop;
		} else {
			return orig_Game_Actor_friendsUnit.call(this);
		}
	};

	const orig_Game_Actor_opponentsUnit = Game_Actor.prototype.opponentsUnit;
	Game_Actor.prototype.opponentsUnit = function() {
		if (this.isSmartZombie()) {
			return $gameParty;
		} else {
			return orig_Game_Actor_opponentsUnit.call(this);
		}
	};

	// rmmz_windows.js
	const orig_Window_BattleLog_displayAddedStates = Window_BattleLog.prototype.displayAddedStates;
	Window_BattleLog.prototype.displayAddedStates = function(target) {
		const result = target.result();
		const states = result.addedStateObjects();
		for (const state of states) {
			if (state.id === alternativeDeathState) {
				this.push("performCollapse", target);
			}
		}
		orig_Window_BattleLog_displayAddedStates.call(this, target);
	};

	// rmmz_managers.js
	const orig_BattleManager_getNextSubject = BattleManager.getNextSubject;
	BattleManager.getNextSubject = function() {
		const subjectQueue = this._actionBattlers.filter(b => (b.isBattleMember && (b.isAlive() || b.isZombie())));
		const aliveSubjectQueue = subjectQueue.filter(b => (b.isBattleMember && b.isAlive()));
		if (subjectQueue[0] !== aliveSubjectQueue[0]) {
			const subject = subjectQueue[0];
			while (this._actionBattlers.length) {
				let subject_ = this._actionBattlers.shift();
				if (subject_ === subject) {
					return subject_;
				}
			}
		}
		return orig_BattleManager_getNextSubject.call(this);
	};

})();
