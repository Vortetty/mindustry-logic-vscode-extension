// Copyright 2022 Winter/Vortetty
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export let validBlocks: string[] = [ // https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/content/Blocks.java
    "air", "spawn", "cliff", "deepwater", "water", "taintedWater", "deepTaintedWater", "tar", "slag", "cryofluid", "stone", "craters", "charr", "sand", "darksand", "dirt", "mud", "ice", "snow", "darksandTaintedWater", "space", "empty",
    "dacite",
    "stoneWall", "dirtWall", "sporeWall", "iceWall", "daciteWall", "sporePine", "snowPine", "pine", "shrubs", "whiteTree", "whiteTreeDead", "sporeCluster",
    "iceSnow", "sandWater", "darksandWater", "duneWall", "sandWall", "moss", "sporeMoss", "shale", "shaleWall", "shaleBoulder", "sandBoulder", "daciteBoulder", "boulder", "snowBoulder", "basaltBoulder", "grass", "salt",
    "metalFloor", "metalFloorDamaged", "metalFloor2", "metalFloor3", "metalFloor4", "metalFloor5", "basalt", "magmarock", "hotrock", "snowWall", "saltWall",
    "darkPanel1", "darkPanel2", "darkPanel3", "darkPanel4", "darkPanel5", "darkPanel6", "darkMetal",
    "pebbles", "tendrils",

    //ores
    "oreCopper", "oreLead", "oreScrap", "oreCoal", "oreTitanium", "oreThorium",

    //crafting
    "siliconSmelter", "siliconCrucible", "kiln", "graphitePress", "plastaniumCompressor", "multiPress", "phaseWeaver", "surgeSmelter", "pyratiteMixer", "blastMixer", "cryofluidMixer",
    "melter", "separator", "disassembler", "sporePress", "pulverizer", "incinerator", "coalCentrifuge",

    //sandbox
    "powerSource", "powerVoid", "itemSource", "itemVoid", "liquidSource", "liquidVoid", "payloadSource", "payloadVoid", "illuminator",

    //defense
    "copperWall", "copperWallLarge", "titaniumWall", "titaniumWallLarge", "plastaniumWall", "plastaniumWallLarge", "thoriumWall", "thoriumWallLarge", "door", "doorLarge",
    "phaseWall", "phaseWallLarge", "surgeWall", "surgeWallLarge", "mender", "mendProjector", "overdriveProjector", "overdriveDome", "forceProjector", "shockMine",
    "scrapWall", "scrapWallLarge", "scrapWallHuge", "scrapWallGigantic", "thruster", //ok, these names are getting ridiculous, but at least I don't have humongous walls yet

    //transport
    "conveyor", "titaniumConveyor", "plastaniumConveyor", "armoredConveyor", "distributor", "junction", "itemBridge", "phaseConveyor", "sorter", "invertedSorter", "router",
    "overflowGate", "underflowGate", "massDriver",
    "duct", "ductRouter", "ductBridge",

    //liquid
    "mechanicalPump", "rotaryPump", "thermalPump", "conduit", "pulseConduit", "platedConduit", "liquidRouter", "liquidContainer", "liquidTank", "liquidJunction", "bridgeConduit", "phaseConduit",

    //power
    "combustionGenerator", "thermalGenerator", "steamGenerator", "differentialGenerator", "rtgGenerator", "solarPanel", "largeSolarPanel", "thoriumReactor",
    "impactReactor", "battery", "batteryLarge", "powerNode", "powerNodeLarge", "surgeTower", "diode",

    //production
    "mechanicalDrill", "pneumaticDrill", "laserDrill", "blastDrill", "waterExtractor", "oilExtractor", "cultivator",

    //storage
    "coreShard", "coreFoundation", "coreNucleus", "vault", "container", "unloader",

    //turrets
    "duo", "scatter", "scorch", "hail", "arc", "wave", "lancer", "swarmer", "salvo", "fuse", "ripple", "cyclone", "foreshadow", "spectre", "meltdown", "segment", "parallax", "tsunami",

    //units
    "commandCenter",
    "groundFactory", "airFactory", "navalFactory",
    "additiveReconstructor", "multiplicativeReconstructor", "exponentialReconstructor", "tetrativeReconstructor",
    "repairPoint", "repairTurret",

    //payloads
    "payloadConveyor", "payloadRouter", "payloadPropulsionTower", "deconstructor", "constructor", "largeConstructor", "payloadLoader", "payloadUnloader",

    //logic
    "message", "switchBlock", "microProcessor", "logicProcessor", "hyperProcessor", "largeLogicDisplay", "logicDisplay", "memoryCell", "memoryBank",

    //campaign
    "launchPad", "interplanetaryAccelerator"
].map(block => `@${block}`);

export let validItems: string[] = [ // https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/content/Items.java
    "scrap", "copper", "lead", "graphite", "coal", "titanium", "thorium", "silicon", "plastanium",
    "phaseFabric", "surgeAlloy", "sporePod", "sand", "blastCompound", "pyratite", "metaglass"
].map(item => `@${item}`);

export let validLiquids: string[] = [ // https://github.com/Anuken/Mindustry/blob/master/core/src/mindustry/content/Liquids.java
    "water", "slag", "oil", "cryofluid"
].map(liquid => `@${liquid}`);

export let predefinedVars: string[] = [
    "@this",
    "@thisx",
    "@thisy",
    "@ipt",
    "@links",
    "@item-internal-name",
    "@liquid-internal-name",
    "@block-internal-name",
    "@unit",
    "@time",
    "@mapw",
    "@maph",
    "@counter"
];

export let sensableVars: string[] = [
    ...validBlocks,
    ...validItems,
    ...validLiquids
];

export let allPredefines: string[] = [
    ...predefinedVars,
    ...sensableVars
]

export let userDefinedVars: Set<string> = new Set();

export let allVars: string[] = [
    ...predefinedVars,
    ...userDefinedVars
];

// Command order
//  - !Read         | read outvar cell1 0
//  - !Get Link     | getlink outvar 0
//  - !Sensor       | sensor outvar block1 @copper
//  - !Set          | set outvar 0
//  - !Operation    | op add outvar a b
//  - !Lookup       | lookup item outvar 0
//  - !Unit Radar   | uradar enemy any any distance 0 1 outvar
//  - !Unit Locate  | ulocate building core true @copper outx outy outvar outvar
export function updateVars(lines: string[]) {
    userDefinedVars = new Set();

    for (let line of lines) {
        const words = line.split(/([\w@-]+|\s+|".*"|'.*')/g).filter(x => (x !== '' && !/^\s*$/.test(x)));
        if (words.length > 0) {
            if (words[0] === 'read')         userDefinedVars.add(words[1]);
            else if (words[0] === 'getlink') userDefinedVars.add(words[1]);
            else if (words[0] === 'sensor')  userDefinedVars.add(words[1]);
            else if (words[0] === 'set')     userDefinedVars.add(words[1]);
            else if (words[0] === 'op')      userDefinedVars.add(words[2]);
            else if (words[0] === 'lookup')  userDefinedVars.add(words[2]);
            else if (words[0] === 'uradar')  userDefinedVars.add(words[5]);
            else if (words[0] === 'ulocate') {
                userDefinedVars.add(words[7]);
                userDefinedVars.add(words[8]);
            }
        }
    }

    allVars = [
        ...predefinedVars,
        ...userDefinedVars
    ];
}


// const tokenTypesLegend = [
//     'mlog_method',    // Instructions (e.g. sensor, op, etc.)
//     'mlog_keyword',   // Keywords (e.g. pwr, xor, etc.)
//     'mlog_parameter', // Parameters (e.g. node1)
//     'mlog_variable',  // Variables set by user, also built-in constants
//     'mlog_string',    // Strings (e.g. "Hello World")
//     'mlog_number',    // Numbers (e.g. 123, -123, 0.123)
//     'mlog_comment',   // Comments (e.g. # <comment text>)
//     'mlog_unknown',   // Unknown tokens
// ];
// tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));
export function identifyType(text: string, index: number, expectedParamCount: number, expectingKeyword=false): string {
    if (index == 0)                                                                                return "mlog_method";
    else if (index+1 > expectedParamCount && expectedParamCount != -1)                             return "mlog_comment";
    else if (text.startsWith("#"))                                                                 return "mlog_comment";
    else if (text.startsWith("\"") || text.startsWith("'") && text.endsWith(text.substring(0, 1))) return "mlog_string";
    else if (/^\d+$/.test(text))                                                                   return "mlog_number";
    else if (allVars.find(v => v === text))                                                        return "mlog_variable";
    else if (/^[^0-9].*$/.test(text))                                                              return expectingKeyword ? "mlog_keyword" :"mlog_parameter";
    else                                                                                           return "mlog_unknown";
}

// const tokenModifiersLegend = [
//     'readonly', // Built-in constants
//     'mlog_invalid',  // Invalid parameter type or syntax
//     'mlog_unknown',  // Unknown parameter but correct type
// ];
export function identifyModifiers(text: string, expectedTypes: string[], index: number, expectedParamCount: number, expectingKeyword=false): string[] {
    let modifiers: Set<string> = new Set();
    let type = identifyType(text, index, expectedParamCount, expectingKeyword);

    if (allPredefines.find(v => v === text))                      modifiers.add("readonly");
    if (expectedTypes.find(v => v === type) == undefined)         modifiers.add("mlog_invalid");
    if (type === "mlog_unknown")                                  modifiers.add("mlog_unknown");

    if (index+1 > expectedParamCount && expectedParamCount != -1) modifiers.add("mlog_unknown");

    return [...modifiers];
}

export interface IParsedToken {
    line: number;
    startCharacter: number;
    length: number;
    tokenType: string;
    tokenModifiers: string[];
}
