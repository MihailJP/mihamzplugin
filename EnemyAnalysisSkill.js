//=============================================================================
// RPG Maker MZ - アナライズスキル用補助プラグイン
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Implements enemy analysis skill which tells player the enemy's weak points &c.
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/EnemyAnalysisSkill.js
 *
 * @param buffColor
 * @text Buff emphasis color
 * @desc Set text color number [0 to 31] for parameters with buff.
 * @default 6
 * @type number
 * @min 0
 * @max 31
 *
 * @param debuffColor
 * @text Debuff emphasis color
 * @desc Set text color number [0 to 31] for parameters with debuff.
 * @default 4
 * @type number
 * @min 0
 * @max 31
 *
 * @param labelHp
 * @text HP
 * @desc Set label for HP. If blank, same as the term specified in the database.
 * @type string
 *
 * @param labelMp
 * @text MP
 * @desc Set label for MP. If blank, same as the term specified in the database.
 * @type string
 *
 * @param labelAtk
 * @text Attack
 * @desc Set label for Attack. If blank, same as the term specified in the database.
 * @default Atk
 * @type string
 *
 * @param labelDef
 * @text Defense
 * @desc Set label for Defense. If blank, same as the term specified in the database.
 * @default Def
 * @type string
 *
 * @param labelMat
 * @text M.Attack
 * @desc Set label for M. Attack. If blank, same as the term specified in the database.
 * @default MAt
 * @type string
 *
 * @param labelMdf
 * @text M.Defense
 * @desc Set label for M. Defense. If blank, same as the term specified in the database.
 * @default MDf
 * @type string
 *
 * @param labelAgi
 * @text Agility
 * @desc Set label for Agility. If blank, same as the term specified in the database.
 * @default Agi
 * @type string
 *
 * @param labelLuk
 * @text Luck
 * @desc Set label for Luck. If blank, same as the term specified in the database.
 * @default Luk
 * @type string
 *
 * @help EnemyAnalysisSkill.js
 *
 * Implements enemy analysis skill which tells player the enemy's weak points &c.
 * Set a common event which executes plugin command `analyzeEnemy`
 * as effect of a battle-only skill.
 * Buff/debuff for each parameter can be shown in color.
 *
 * Typical usage:
 * - Simply "Run analysis skill". Requires no parameters.
 *   Target enemy character is automatically detected.
 *
 * License: The Unlicense
 *
 * Changelog
 * 21 Sept 2020: Fix parameter type
 * 20 Sept 2020: Fix wrong target (or crash if very first turn)
 * 16 Sept 2020: Fix syntax error (parentheses mismatch)
 * 14 Sept 2020: First edition.
 *
 * @command analyzeEnemy
 * @text Run analysis skill
 * @desc Runs analysis skill. Call from a common event during a battle.
 *
 * @command analyzeEnemyByIndex
 * @text Run analysis skill (immediate value)
 * @desc Runs analysis skill with manually specified target. Usually not needed.
 *
 * @arg enemy_index
 * @type number
 * @text Index of enemy character
 * @desc Index of enemy character for target of the skill.
 * @min 1
 * @max 8
 *
 * @command analyzeEnemyByVariable
 * @text Run analysis skill (by variable)
 * @desc Runs analysis skill with variable-specified target. Usually not needed.
 *
 * @arg enemy_index_var
 * @type variable
 * @text Variable for index of enemy character
 * @desc Variable that contains index of enemy character for target of the skill.
 *
 */

/*:ja
 * @target MZ
 * @plugindesc アナライズスキル（敵の弱点とかがわかる）を実装します。
 * @author MihailJP
 * @url https://github.com/MihailJP/mihamzplugin/blob/master/EnemyAnalysisSkill.js
 *
 * @param buffColor
 * @text ステータス上昇時の文字色
 * @desc ステータス上昇時の文字色を0～31で設定します。
 * @default 6
 * @type number
 * @min 0
 * @max 31
 *
 * @param debuffColor
 * @text ステータス低下時の文字色
 * @desc ステータス低下時の文字色を0～31で設定します。
 * @default 4
 * @type number
 * @min 0
 * @max 31
 *
 * @param labelHp
 * @text ＨＰ
 * @desc 「ＨＰ」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @type string
 *
 * @param labelMp
 * @text ＭＰ
 * @desc 「ＭＰ」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @type string
 *
 * @param labelAtk
 * @text 攻撃力
 * @desc 「攻撃力」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 攻撃
 * @type string
 *
 * @param labelDef
 * @text 防御力
 * @desc 「防御力」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 防御
 * @type string
 *
 * @param labelMat
 * @text 魔法力
 * @desc 「魔法力」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 魔力
 * @type string
 *
 * @param labelMdf
 * @text 魔法防御
 * @desc 「魔法防御」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 魔防
 * @type string
 *
 * @param labelAgi
 * @text 敏捷性
 * @desc 「敏捷性」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 敏捷
 * @type string
 *
 * @param labelLuk
 * @text 運
 * @desc 「運」の表示を指定します。指定しないときはデータベースで指定した用語と同じになります。
 * @default 運
 * @type string
 *
 * @help EnemyAnalysisSkill.js
 *
 * アナライズスキル（敵の弱点とかがわかる）を実装します。
 * コモンイベントからプラグインコマンド analyzeEnemy を実行します。
 * そのコモンイベントを、戦闘中のみ使用可能なスキルの効果として設定してください。
 * ステータスの強化／弱体時に色を付けて表示することもできます。
 *
 * 典型的な使用法：
 * - 「アナライズを実行」します。引数はありません。対象は自動的に認識します。
 *
 * ライセンス: Unlicense
 *
 * 更新履歴
 * 令和2年9月21日 パラメータの型を修正
 * 令和2年9月20日 対象が正しくない（初手で使うと落ちる）のを修正
 * 令和2年9月16日 文法エラー（括弧が対応していない）を修正
 * 令和2年9月14日 初版
 *
 * @command analyzeEnemy
 * @text アナライズを実行
 * @desc アナライズスキルを実行します。戦闘中にコモンイベントから呼び出してください。
 *
 * @command analyzeEnemyByIndex
 * @text アナライズを実行（直接指定）
 * @desc 対象を指定してアナライズスキルを実行します。通常は使用しません。
 *
 * @arg enemy_index
 * @type number
 * @text 敵インデックス
 * @desc スキルの対象となる敵インデックスを指定します。
 * @min 1
 * @max 8
 *
 * @command analyzeEnemyByVariable
 * @text アナライズを実行（変数指定）
 * @desc 対象を変数で指定してアナライズスキルを実行します。通常は使用しません。
 *
 * @arg enemy_index_var
 * @type variable
 * @text 敵インデックス変数
 * @desc スキルの対象となる敵インデックスを格納した変数を指定します。
 *
 */

(() => {
    const pluginName = "EnemyAnalysisSkill";
	const param = PluginManager.parameters(pluginName);

    const analyzeEnemy = function(enemy) {
		const isJapanese = Boolean($dataSystem.locale.match(/^ja[^[:alpha:]]?/));
		// ステータスの上昇または低下時に色を付ける
		const colorBuff = function(enemy, paramId) {
			if (enemy.isBuffAffected(paramId)) {
				return "\\C[" + param.buffColor.parseInt().toString() + "]";
			} else if (enemy.isDebuffAffected(paramId)) {
				return "\\C[" + param.debuffColor.parseInt().toString() + "]";
			} else {
				return "";
			}
		};
		
		// 初期設定
		$gameMessage.setFaceImage("", 0);
		$gameMessage.setBackground(1);
		$gameMessage.setPositionType(1);
		$gameMessage.setSpeakerName("");
		
		// 名前、ＨＰ、ＭＰ
		$gameMessage.add(enemy.originalName()
			+ "  " + (param.labelHp || $dataSystem.terms.basic[2]) + (isJapanese ? "：" : ":") + enemy.hp.toString() + "/" + colorBuff(enemy, 0) + enemy.mhp.toString()
			+ "\\C[0]　" + (param.labelMp || $dataSystem.terms.basic[4]) + (isJapanese ? "：" : ":") + enemy.mp.toString() + "/" + colorBuff(enemy, 1) + enemy.mmp.toString());
		// 基本パラメータ
		$gameMessage.add("\\C[0]" + (param.labelAtk || $dataSystem.terms.params[2]) + ":" + colorBuff(enemy, 2) + enemy.atk.toString()
			+ "\\C[0] " + (param.labelDef || $dataSystem.terms.params[3]) + ":" + colorBuff(enemy, 3) + enemy.def.toString()
			+ "\\C[0] " + (param.labelMat || $dataSystem.terms.params[4]) + ":" + colorBuff(enemy, 4) + enemy.mat.toString()
			+ "\\C[0] " + (param.labelMdf || $dataSystem.terms.params[5]) + ":" + colorBuff(enemy, 5) + enemy.mdf.toString()
			+ "\\C[0] " + (param.labelAgi || $dataSystem.terms.params[6]) + ":" + colorBuff(enemy, 6) + enemy.agi.toString()
			+ "\\C[0] " + (param.labelLuk || $dataSystem.terms.params[7]) + ":" + colorBuff(enemy, 7) + enemy.luk.toString());
		// 弱点・耐性
		$gameMessage.add((isJapanese ? "\\C[0]弱点：" : "\\C[0]Weak: ")
			+ (enemy.traits(11).filter(trait => trait.value > 1).map(trait => $dataSystem.elements[trait.dataId]).join(" ") || (isJapanese ? "なし" : "None")));
		$gameMessage.add((isJapanese ? "\\C[0]耐性：" : "\\C[0]Resists: ")
			+ (enemy.traits(11).filter(trait => trait.value < 1).map(trait => $dataSystem.elements[trait.dataId]).join(" ") || (isJapanese ? "なし" : "None")));
		// ステート耐性等
		$gameMessage.add(isJapanese ? "ステート耐性・有効ステート" : "State Susceptibility");
		$gameMessage.add((isJapanese ? "\\C[0]有効：" : "\\C[0]Susceptible: ")
			+ (enemy.traits(13).filter(trait => trait.value > 1).map(trait => $dataStates[trait.dataId]).concat(
			enemy.traits(12).filter(trait => trait.value > 1).map(trait => $dataSystem.terms.params[trait.dataId] + (isJapanese ? "低下" : " debuff"))
			).join(" ") || (isJapanese ? "なし" : "None")));
		$gameMessage.add((isJapanese ? "\\C[0]耐性：" : "\\C[0]Resists: ")
			+ (enemy.traits(13).filter(trait => trait.value < 1).map(trait => $dataStates[trait.dataId]).concat(
			enemy.traits(12).filter(trait => trait.value < 1).map(trait => $dataSystem.terms.params[trait.dataId] + (isJapanese ? "低下" : " debuff"))
			).join(" ") || (isJapanese ? "なし" : "None")));
		if (enemy.traits(14).length > 0) {
			$gameMessage.add((isJapanese ? "\\C[18]無効：" : "\\C[18]Immune: ")
				+ enemy.traits(14).map(trait => $dataStates[trait.dataId]).join(" ") );
		}
    };
	
    PluginManager.registerCommand(pluginName, "analyzeEnemy", args => {
		analyzeEnemy($gameTroop.members()[$gameTemp.lastActionData(5) - 1]);
    });
    PluginManager.registerCommand(pluginName, "analyzeEnemyByIndex", args => {
		analyzeEnemy($gameTroop.members()[parseInt(args.enemy_index)]);
    });
    PluginManager.registerCommand(pluginName, "analyzeEnemyByVariable", args => {
		analyzeEnemy($gameTroop.members()[$gameVariables.value(parseInt(args.enemy_index_var)) - 1]);
    });

})();
