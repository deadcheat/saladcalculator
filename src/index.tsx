import { h, app } from "hyperapp"
import 'bulma/css/bulma.css'

import * as logo from './assets/salad_small.png'

interface ToppingKV {
    [index: number]: number
}

const toppingCountMap: ToppingKV = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
    31: 0,
    32: 0,
    33: 0,
    34: 0,
    35: 0,
    36: 0,
    37: 0,
    38: 0,
    39: 0,
    40: 0,
}

const state = {
    total: 0,
    countMap: {
        "base": 0,
        "topping": 0,
        "dressing": 0,
    },
    toppingCountMap: toppingCountMap,
}

const baseIds = [1, 2, 3]

const baseCalorieMap: ToppingKV = {
    1: 22,
    2: 14,
    3: 270,
}

const toppingIds = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

var toppingCalorieMap: ToppingKV = {
    4: 70,
    5: 60,
    6: 85,
    7: 85,
    8: 100,
    9: 8,
    10: 9,
    11: 20,
    12: 14,
    13: 10,
    14: 16,
    15: 1,
    16: 1,
    17: 29,
    18: 4,
    19: 16,
    20: 51,
    21: 55,
    22: 38,
    23: 34,
}

const premiumIds = [24, 25, 26, 27, 28, 29]

const premiumCalorieMap: ToppingKV = {
    24: 127,
    25: 157,
    26: 89,
    27: 83,
    28: 52,
    29: 47,
}

const dressingIds = [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]

const dressingCalorieMap: ToppingKV = {
    30: 118,
    31: 92,
    32: 122,
    33: 91,
    34: 111,
    35: 191,
    36: 70,
    37: 153,
    38: 228,
    39: 2,
    40: 2,
}

interface ToppingNameTuple {
    [index: number]: string
}

const toppingNameMapper: ToppingNameTuple = {
    1: "ロメインレタス",
    2: "ほうれん草",
    3: "ワイルドライス＋雑穀米",
    4: "自家製クルトン",
    5: "レーズン",
    6: "サンフラワーシード",
    7: "アーモンド",
    8: "ウォルナッツ",
    9: "スナップエンドウ",
    10: "セロリ",
    11: "キャロット",
    12: "赤玉ねぎ",
    13: "トマト",
    14: "赤キャベツ",
    15: "シラントロ",
    16: "バジル",
    17: "アップル",
    18: "オレンジ",
    19: "スパイシーブロッコリ",
    20: "グリルドコーン",
    21: "ブラックビーンズ",
    22: "ハードボイルド・エッグ",
    23: "ロースト豆腐",
    24: "グリルドチキン",
    25: "自家製ハム",
    26: "アボカド",
    27: "ホワイトチェダーチーズ",
    28: "フェタチーズ",
    29: "パルメザンチーズ",
    30: "バルサミックビネグレット",
    31: "バターミルクランチ",
    32: "クリーミーシラチャー",
    33: "メキシカンハニービネグレット",
    34: "シーザー",
    35: "レモンタヒに",
    36: "バジルオニオン",
    37: "キャロットチリビネグレット",
    38: "EXバージンオリーブオイル",
    39: "レモンスクイーズ",
    40: "ライムスクイーズ",
}

type State = typeof state

const actions = {
    addTopping: (tId: number) => (state: State) => {
        state.countMap.topping = state.countMap.topping + toppingCalorieMap[tId]
        state.toppingCountMap[tId] = state.toppingCountMap[tId] + 1
        return
    },
    removeTopping: (tId: number) => (state: State) => {
        if (state.toppingCountMap[tId] == 0) {
            return
        }
        state.countMap.topping = state.countMap.topping - toppingCalorieMap[tId]
        state.toppingCountMap[tId] = state.toppingCountMap[tId] - 1
        return
    },
    addPremiumTopping: (tId: number) => (state: State) => {
        state.countMap.topping = state.countMap.topping + premiumCalorieMap[tId]
        state.toppingCountMap[tId] = state.toppingCountMap[tId] + 1
        return
    },
    removePremiumTopping: (tId: number) => (state: State) => {
        if (state.toppingCountMap[tId] == 0) {
            return
        }
        state.countMap.topping = state.countMap.topping - premiumCalorieMap[tId]
        state.toppingCountMap[tId] = state.toppingCountMap[tId] - 1
        return
    },
    setDressing: (tId: number) => (state: State) => {
        if (tId == 0 || dressingCalorieMap[tId] == 0) {
            return
        }
        state.countMap.dressing = dressingCalorieMap[tId]
        return
    },
    setBase: (tId: number) => (state: State) => {
        console.log(tId)
        if (tId == 0 || baseCalorieMap[tId] == 0) {
            return
        }
        state.countMap.base = baseCalorieMap[tId]
        return
    },
    sum: () => (state: State) => {
        state.total = state.countMap.base + state.countMap.dressing + state.countMap.topping
        return state
    },
    total: () => (total: number) => (
        state.countMap.base + state.countMap.dressing + state.countMap.topping
    ),
    name: (tId: number) => (name: string) => {
        return toppingNameMapper[tId]
    },
    toppingCount: (tId: number) => (count: number) => {
        return state.toppingCountMap[tId]
    },
    toppingCalorie: (tId: number) => (count: number) => {
        return toppingCalorieMap[tId]
    },
    premiumToppingCalorie: (tId: number) => (count: number) => {
        return premiumCalorieMap[tId]
    },
}

type Actions = typeof actions

const view = (state: State, actions: Actions) => (
    <div className="container">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-brand">
                <div class="navbar-item" href="">
                    <img src={logo.default} alt="icon is here" width="32" height="28" />&nbsp;カスタムサラダのカロリー計算するやーつ
                </div>
            </div>
        </nav>
        <div>
            <header>
                <section class="section hero is-bold is-danger">
                    <div class="hero-body">
                        <div class="container">
                            <div class="title is-bold is-danger">このサラダのカロリー：{actions.total} KCal</div>
                        </div>
                    </div>
                </section>
            </header>
            <table class="table is-fullwidth">
                <tr>
                    <td>
                        <div class="field">
                            <label class="label">サラダのベースを選びます</label>
                            <div class="select">
                                <form name="baseform">
                                    <select name="base" onchange={(e: Event) => { (actions.setBase(document.baseform.base.options[document.baseform.base.selectedIndex].value)) }}>
                                        <option value="0" selected>お選びください</option>
                                        {
                                            baseIds.map((tId: number) => (
                                                <option value={tId}>{() => (actions.name(tId))}</option>
                                            ))
                                        }
                                    </select>
                                </form>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div class="field">
                            <label class="label">ドレッシングを選びます</label>
                            <div class="select">
                                <form name="dressingform">
                                    <select name="dressing" onchange={(e: Event) => { (actions.setDressing(document.dressingform.dressing.options[document.dressingform.dressing.selectedIndex].value)) }}>
                                        <option value="0" selected>お選びください</option>
                                        {
                                            dressingIds.map((tId: number) => (
                                                <option value={tId}>{() => (actions.name(tId))}</option>
                                            ))
                                        }
                                    </select>
                                </form>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
            <div class="field">
                <label class="label">トッピングを選びます（４つまで無料）</label>
                <table className="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>トッピング</th>
                            <th>１単位あたりのカロリー</th>
                            <th>個数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            toppingIds.map((tId: number) => (
                                <tr>
                                    <td>{() => (actions.name(tId))}</td>
                                    <td>{() => (actions.toppingCalorie(tId))}&nbsp;KCal</td>
                                    <td>{() => (actions.toppingCount(tId))}&nbsp;
                                    <button onclick={() => (actions.addTopping(tId))}>&nbsp;+&nbsp;</button>&nbsp;
                                    <button onclick={() => (actions.removeTopping(tId))}>&nbsp;-&nbsp;</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div class="field">
                <label class="label">プレミアムトッピングを選びます（追加料金がかかります）</label>
                <table className="table is-striped is-hoverable is-fullwidth">
                    <thead>
                        <tr>
                            <th>トッピング</th>
                            <th>１単位あたりのカロリー</th>
                            <th>個数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            premiumIds.map((tId: number) => (
                                <tr>
                                    <td>{() => (actions.name(tId))}</td>
                                    <td>{() => (actions.premiumToppingCalorie(tId))}&nbsp;KCal</td>
                                    <td>{() => (actions.toppingCount(tId))}&nbsp;
                                    <button onclick={() => (actions.addPremiumTopping(tId))}>&nbsp;+&nbsp;</button>&nbsp;
                                    <button onclick={() => (actions.removePremiumTopping(tId))}>&nbsp;-&nbsp;</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div >
)

const main = app<State, Actions>(state, actions, view, document.body)
