/*
 * Copyright 2013 Cameron McKay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//import { playSound, playEffect } from './sound';

require.config({
    paths: {
        jquery: "lib/jquery",
        zlib: "lib/zlib.min",
        tmxjs: "src"
    },
    shim: {
        zlib: { exports: "Zlib" }
    }
});

require([
    "tmxjs/map",
    "tmxjs/util/util",
    "sound"
], function (
    Map,
    U
) {
    let url = "examples/desert.tmx";

    let options = {
        dir: url.split("/").slice(0, -1) || "."
    };

    let worldmap = document.getElementById("map");

    let topChar = 320;
    let leftChar = 544;
    let positionInitLeft = -8;
    let positionInitRight = 121;

    let maxHealth = 100;
    let currentHealth = 100;

    let isInventoryDisplayed = false;

    //Create a function to display and move items inside character
    const displayCharacter = () => {

        let characterDiv = document.createElement("div");

        //@TODO : - Add character id
        characterDiv.setAttribute("id", "characterDiv");
        characterDiv.setAttribute("style", U.format("width: 48px; height: 55px; z-index: 2; position: absolute; left: {0}px; top: {1}px;", leftChar, topChar));

        let characterBody = document.createElement("div");
        characterBody.setAttribute("id", "characterBody");
        characterBody.setAttribute("style", U.format("width: 48px; height: 55px; position: absolute; z-index: 2; background: url('/examples/sprites/BODY_male.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));

        let characterHair = document.createElement("div");
        characterHair.setAttribute("id", "characterHair");
        characterHair.setAttribute("style", U.format("width: 48px; height: 20px; position: absolute; z-index: 3; background: url('/examples/sprites/HEAD_leather_armor_hat.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));

        let characterArmor = document.createElement("div");
        characterArmor.setAttribute("id", "characterArmor");
        characterArmor.setAttribute("style", U.format("width: 48px; height: 48px; position: absolute; z-index: 3; background: url('/examples/sprites/TORSO_leather_armor_torso.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));

        let characterWeapon = document.createElement("div");
        characterWeapon.setAttribute("id", "characterWeapon");
        characterWeapon.setAttribute("style", U.format("width: 48px; height: 48px; position: absolute; z-index: 3; background: url('/examples/sprites/WEAPON_dagger.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));

        characterDiv.appendChild(characterBody);
        characterDiv.appendChild(characterHair);
        characterDiv.appendChild(characterArmor);
        characterDiv.appendChild(characterWeapon);

        worldmap.appendChild(characterDiv);
    };

    const displayAndMoveCharacter = (leftChar, topChar, positionInitLeft, positionInitRight) => {

        let characterDiv = document.getElementById("characterDiv");
        let characterBody = document.getElementById("characterBody");
        let characterHair = document.getElementById("characterHair");
        let characterArmor = document.getElementById("characterArmor");
        let characterWeapon = document.getElementById("characterWeapon");

        characterDiv.setAttribute("style", U.format("width: 48px; height: 55px; z-index: 2; position: absolute; left: {0}px; top: {1}px;", leftChar, topChar));
        characterBody.setAttribute("style", U.format("width: 48px; height: 55px; position: absolute; z-index: 2; background: url('/examples/sprites/BODY_male.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));
        characterHair.setAttribute("style", U.format("width: 48px; height: 20px; position: absolute; z-index: 2; background: url('/examples/sprites/HEAD_leather_armor_hat.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));
        characterArmor.setAttribute("style", U.format("width: 48px; height: 48px; position: absolute; z-index: 2; background: url('/examples/sprites/TORSO_leather_armor_torso.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));
        characterWeapon.setAttribute("style", U.format("width: 48px; height: 48px; position: absolute; z-index: 2; background: url('/examples/sprites/WEAPON_dagger.png'); background-position: {0}px {1}px;", positionInitLeft, positionInitRight));
    };

    //Move a character
    const moveCharacter = event => {

        //Take damage method
        //Si leftChar est entre -42 leftBot et + 42 && topChar est entre - 32 et +32 topBot

        if (leftChar >= leftBot - 42 && leftChar <= leftBot + 42 && topChar >= topBot - 32 && topChar <= topBot + 32) {
            console.log('take damage')
            playEffect("melee_sound.wav");
            currentHealth -= 1;
            displayLifeBar(currentHealth);
        }

        //Up
        if (event.key === "ArrowUp") {
            topChar -= 3;
            positionInitRight = 241;
        }

        //Down
        if (event.key === "ArrowDown") {
            topChar += 3;
            positionInitRight = 121;
        }

        //Left
        if (event.key === "ArrowLeft") {
            leftChar -= 3;
            positionInitRight = 181;
        }

        //Right
        if (event.key === "ArrowRight") {
            leftChar += 3;
            positionInitRight = 53;
        }

        displayAndMoveCharacter(leftChar, topChar, positionInitLeft, positionInitRight);
    };

    const displayLifeBar = (currentHealth) => {

        let checkLifeBar = document.getElementById("lifeBar");

        if (checkLifeBar !== null) {
            worldmap.removeChild(checkLifeBar);
        }

        let lifeBar = document.createElement("div");
        lifeBar.setAttribute("id", 'lifeBar');

        lifeBar.setAttribute("style", "width: 150px; height: 25px; position: absolute; z-index: 999; top: 30px; left: 30px; border: solid 1px #aaa;");

        let lifeCount = document.createElement("div");
        let lifeCountText = document.createTextNode(currentHealth + "%");

        lifeCount.appendChild(lifeCountText);
        lifeCount.setAttribute("style", `color: black; width: ${currentHealth}%; background-color: red; display: flex; align-items: center; justify-content: center; height: 100%;`);

        lifeBar.appendChild(lifeCount);

        worldmap.appendChild(lifeBar);
    };

    const items = () => {
        let potions = "examples/items/potions_preview.png";

        /*let displayPotions = document.createElement("div");
        displayPotions.setAttribute("id", "potions");
        displayPotions.setAttribute("style", `background-image: ${potions}; height: 24px; width: 24px;`);*/

        //let displayPotions = document.createElement('div');
        //displayPotions.innerHTML = '<div><a href="#"></a><span></span></div>';

        console.log(potions)

        const allItems = [
            {
                potions: [
                    {
                        url: 'examples/items/potions.png',
                        idItem: 1,
                        currentHealth: 50
                    }
                ]
            }
        ];

        return [potions, { idItem: 1 }];
    };

    const useItems = item => {
        console.log(item)
        if (item.idItem === 1) {
            currentHealth += 50;
            if (currentHealth >= maxHealth) {
                currentHealth = 100;
            }
            displayLifeBar(currentHealth);
        }
    };

    const displayInventory = (event) => {
        console.log(event)
        console.log(event.key)

        if (event.code === "KeyI" && isInventoryDisplayed === true) {

            console.log(isInventoryDisplayed)

            let getInventory = document.getElementById("inventory");

            let worldmap = document.getElementById("map");

            worldmap.removeChild(getInventory);

            isInventoryDisplayed = false;
        }
        else if (event.code === "KeyI" && isInventoryDisplayed === false) {

            playEffect("land.wav");

            isInventoryDisplayed = true;

            let inventory = document.createElement("div");
            inventory.setAttribute("id", "inventory");
            inventory.setAttribute("style", "width: 300px; height: 400px; border: 3px solid rgba(95, 73, 46, .7); border-radius: 6px; background-color: #856D4D; opacity: 1.0; z-index: 2; position: absolute; top: 100px; left: 415px; display: flex; flex-direction:  column; align-items: flex-end;");

            const arrayInventory1 = ["cell1", "cell2", "cell3", "cell4"];
            const arrayInventory2 = ["cell5", "cell6", "cell7", "cell8"];

            let title = document.createElement("div");

            let content = document.createElement("div");

            let inventoryTable = document.createElement("table");
            inventoryTable.setAttribute("style", "width: 100%; height: 40%; border: 1px solid black;")
            let inventoryRow1 = document.createElement("tr");
            let inventoryRow2 = document.createElement("tr");
            //let inventoryCell = document.createElement("td");

            const potions = items();

            arrayInventory1.forEach(
                (arrayInventoryItem, index) => {
                    if (arrayInventoryItem !== undefined) {
                        let inventoryCell = document.createElement("td");
                        inventoryCell.setAttribute("id", `${arrayInventoryItem}`);
                        inventoryCell.setAttribute("style", "height: 50px; width: 50px; border: 1px solid black; background-color: lightslategray;");
                        inventoryCell.addEventListener("click", () => alert(`test ${arrayInventoryItem}`));

                        if (index === 0) {

                            let wrapper = document.createElement('td');
                            wrapper.setAttribute("id", `${arrayInventoryItem}`);
                            wrapper.setAttribute("style", "height: 50px; width: 50px; border: 1px solid black; background-color: lightslategray;");

                            wrapper.addEventListener(
                                "click", () => {
                                    useItems(potions[1]);
                                    let cell1 = document.getElementById("cell1");
                                    cell1.removeChild(cell1.firstChild);
                                }
                            );
                            wrapper.innerHTML = `<div style="background: url(${potions[0]}); width: 38px; height: 32px; background-position-x: -27px; background-position-y: 0px"></div>`;

                            console.log(potions)
                            inventoryCell = wrapper;
                            console.log(inventoryCell)
                        }

                        inventoryRow1.appendChild(inventoryCell);
                    }
                }
            );
            arrayInventory2.forEach(
                arrayInventoryItem => {
                    if (arrayInventoryItem !== undefined) {
                        let inventoryCell = document.createElement("td");
                        inventoryCell.setAttribute("id", `${arrayInventoryItem}`);
                        inventoryCell.setAttribute("style", "height: 50px; width: 50px; border: 1px solid black; background-color: lightslategray;");
                        inventoryRow2.appendChild(inventoryCell);
                    }
                }
            );

            inventoryTable.appendChild(inventoryRow1);
            inventoryTable.appendChild(inventoryRow2);

            inventory.appendChild(title);
            inventory.appendChild(inventoryTable);

            worldmap.appendChild(inventory);
        }
    };

    let cpt = 0;

    document.addEventListener("keydown", event => {

        displayInventory(event);

        switch (cpt) {
            case 1:
                positionInitLeft = -70;
                break;
            case 2:
                positionInitLeft = -134;
                break;
            case 3:
                positionInitLeft = -198;
                break;
            case 4:
                positionInitLeft = -262;
                break;
            case 5:
                positionInitLeft = -326;
                break;
            case 6:
                positionInitLeft = -392;
                break;
            case 7:
                positionInitLeft = -454;
                break;
            case 8:
                positionInitLeft = -8;
                cpt = 0;
                break;
            default:
                break;
        }
        cpt++;

        displayAndMoveCharacter(leftChar, topChar, positionInitLeft, positionInitRight);
        setInterval(moveCharacter(event), 4000);
    });

    //Pure js (ECMA6)
    //Display the map
    fetch(url)
        .then(
            res => res.text()
        )
        .then(
            text => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(text, "application/xml");

                Map.fromXML(doc, options).then(
                    map => {

                        playSound();

                        document.getElementById("map").setAttribute("width", `${map.bounds.w * map.tileInfo.w}`);
                        document.getElementById("map").setAttribute("height", `${map.bounds.h * map.tileInfo.h}`);

                        let canvas = document.getElementById("map");

                        let ruleSets = {};

                        let mapLayers = map.layers;

                        mapLayers.forEach((mapLayerItem, ln) => {
                            let mapLayerCells = mapLayerItem.cells;

                            mapLayerCells.forEach((cell, tn) => {
                                if (!cell) return true;

                                let i = tn % mapLayerItem.bounds.w;

                                let j = Math.floor(tn / mapLayerItem.bounds.w);
                                let tileSet = cell.tile.tileSet;

                                let flippedClass = U.format("flipped-{0}-{1}-{2}",
                                    +cell.flipped.horizontally,
                                    +cell.flipped.vertically,
                                    +cell.flipped.antidiagonally);

                                let classes = [
                                    "tile-set",
                                    "tile-set-" + tileSet.firstGlobalId,
                                    "tile",
                                    "tile-" + cell.tile.getGlobalId(),
                                    flippedClass
                                ];

                                let format, ruleSet;

                                if (!ruleSets["tile-set-"] + tileSet.firstGlobalId) {
                                    format = ["background-image: url({0});"].join("/");
                                    ruleSet = U.format(format, options.dir + "/" + cell.tile.imageInfo.source);
                                    ruleSets["tile-set-" + tileSet.firstGlobalId] = ruleSet;
                                }

                                if (!ruleSets["tile-" + cell.tile.getGlobalId()]) {
                                    format = [
                                        "width: {0}px;",
                                        "height: {1}px;",
                                        "background-repeat: no-repeat;",
                                        "background-position: {2}px {3}px;"
                                    ].join(" ");
                                    ruleSet = U.format(format,
                                        +cell.tile.bounds.w,
                                        +cell.tile.bounds.h,
                                        -cell.tile.bounds.x,
                                        -cell.tile.bounds.y
                                    );
                                    ruleSets["tile-" + cell.tile.getGlobalId()] = ruleSet;
                                }
                                if (!ruleSets[flippedClass]) {
                                    let m = [1, 0, 0, 1];
                                    if (cell.flipped.antidiagonally) {
                                        m[0] = 0;
                                        m[1] = 1;
                                        m[2] = 1;
                                        m[3] = 0;
                                    }
                                    if (cell.flipped.horizontally) {
                                        m[0] = -m[0];
                                        m[2] = -m[2];
                                    }
                                    if (cell.flipped.vertically) {
                                        m[1] = -m[1];
                                        m[3] = -m[3];
                                    }
                                    let matrix = U.format("matrix({0}, {1}, {2}, {3}, 0, 0)", m[0], m[1], m[2], m[3]);
                                    let dxMatrix = U.format(
                                        "progid:DXImageTransform.Microsoft.Matrix(M11={0},M12={1},M21={2},M22={3},sizingMethod='auto expand')",
                                        m[0], m[1], m[2], m[3]
                                    );
                                    ruleSet = [
                                        "-moz-transform: " + matrix + ";",
                                        "-o-transform: " + matrix + ";",
                                        "-webkit-transform: " + matrix + ";",
                                        "transform: " + matrix + ";",
                                        '-ms-filter: "' + dxMatrix + '";',
                                        "filter: " + dxMatrix + ";"
                                    ].join(" ");
                                    ruleSets[flippedClass] = ruleSet;
                                }

                                let newDiv = document.createElement("div");

                                newDiv.setAttribute("id", 'tile-' + tn);
                                newDiv.setAttribute("class", classes.join(" "));
                                newDiv.setAttribute("style", U.format("left: {0}px; top: {1}px;", i * cell.tile.bounds.w, j * cell.tile.bounds.h));

                                canvas.appendChild(newDiv);

                                return true;
                            });
                        });

                        //Create the CSS classes.
                        //@TODO: - Create js file later (css)
                        let d = document, style = d.createElement('style');
                        d.getElementsByTagName('head')[0].appendChild(style);
                        style.setAttribute('type', 'text/css');

                        let styleSheet = [".tile { position: absolute; }"];

                        for (const [key, value] of Object.entries(ruleSets)) {
                            styleSheet.push(U.format(".{0} { {1} }", key, value));
                        }
                        style.appendChild(document.createTextNode(styleSheet.join("\n")));
                    }
                )
            }
        )
        .catch((error) => {
            alert(`${error} - Failed to open TMX file.`);
        });

    //items();
    displayLifeBar(currentHealth);

    let botCombat = document.createElement("div");
    let topBot = 240;
    let leftBot = 784;
    botCombat.setAttribute("id", 'fightBot');
    botCombat.setAttribute("style", U.format("left: {0}px; top: {1}px;", leftBot, topBot));

    worldmap.appendChild(botCombat);

    displayCharacter();
});
