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
    "jquery",
    "tmxjs/map",
    "tmxjs/util/util"
], function (
    $,
    Map,
    U
) {
    var url = "examples/desert.tmx";

    var options = {
        dir: url.split("/").slice(0, -1) || "."
    };

    //Pure js (ECMA6)
    fetch(url)
        .then(
            res => res.text()
        )
        .then(
            text => {
                var parser = new DOMParser();
                var doc = parser.parseFromString(text, "application/xml");

                Map.fromXML(doc, options).then(
                    map => {

                        // map.tileSets.forEach(mapItem => {
                        //     console.log(mapItem)
                        // });

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
                        //let style = document.createElement("style");
                        //style.setAttribute("type", 'text/css');

                        let d = document, style = d.createElement('style');
                        d.getElementsByTagName('head')[0].appendChild(style);
                        style.setAttribute('type', 'text/css');

                        let styleSheet = [".tile { position: absolute; }"];

                        for (const [key, value] of Object.entries(ruleSets)) {
                            styleSheet.push(U.format(".{0} { {1} }", key, value));
                        }

                        //style.innerHtml = styleSheet.join("\n");

                        //console.log(style.innerHtml)

                        // style = $("<style>", { type: 'text/css' })
                        //     .html(styleSheet.join("\n"));

                        style.cssText = styleSheet.join("\n");
                        console.log(style.cssText)
                    }
                )
            }
        )
        .catch((error) => {
            alert(`${error} - Failed to open TMX file.`);
        });;

    //JQUERY
    // $.get(url, {}, null, "xml")
    //     .done(function (xml) {
    //         Map.fromXML(xml, options).done(function (map) {
    //             // Export to XML when "x" key pressed.
    //             $(document).on("keypress", function (event) {
    //                 if (String.fromCharCode(event.which) === "x") {
    //                     var doc = map.toXML(options);
    //                 }
    //             });
    //             $.each(map.tileSets, function () {
    //                 console.log(this);
    //             });

    //             var canvas = $("#map").css({
    //                 width: map.bounds.w * map.tileInfo.w,
    //                 height: map.bounds.h * map.tileInfo.h
    //             });

    //             console.log(canvas)

    //             var ruleSets = {};
    //             $.each(map.layers, function (ln, layer) {
    //                 $.each(layer.cells, function (tn, cell) {
    //                     if (!cell) return true;

    //                     var i = tn % layer.bounds.w;
    //                     var j = Math.floor(tn / layer.bounds.w);
    //                     var tileSet = cell.tile.tileSet;

    //                     var flippedClass = U.format("flipped-{0}-{1}-{2}",
    //                         +cell.flipped.horizontally,
    //                         +cell.flipped.vertically,
    //                         +cell.flipped.antidiagonally);
    //                     var classes = [
    //                         "tile-set",
    //                         "tile-set-" + tileSet.firstGlobalId,
    //                         "tile",
    //                         "tile-" + cell.tile.getGlobalId(),
    //                         flippedClass
    //                     ];

    //                     var format, ruleSet;
    //                     if (!ruleSets["tile-set-"] + tileSet.firstGlobalId) {
    //                         format = [
    //                             "background-image: url({0});"
    //                         ].join("/");
    //                         ruleSet = U.format(format, options.dir + "/" + cell.tile.imageInfo.source);
    //                         ruleSets["tile-set-" + tileSet.firstGlobalId] = ruleSet;
    //                     }
    //                     if (!ruleSets["tile-" + cell.tile.getGlobalId()]) {
    //                         format = [
    //                             "width: {0}px;",
    //                             "height: {1}px;",
    //                             "background-repeat: no-repeat;",
    //                             "background-position: {2}px {3}px;"
    //                         ].join(" ");
    //                         ruleSet = U.format(format,
    //                             +cell.tile.bounds.w,
    //                             +cell.tile.bounds.h,
    //                             -cell.tile.bounds.x,
    //                             -cell.tile.bounds.y
    //                         );
    //                         ruleSets["tile-" + cell.tile.getGlobalId()] = ruleSet;
    //                     }
    //                     if (!ruleSets[flippedClass]) {
    //                         var m = [1, 0, 0, 1];
    //                         if (cell.flipped.antidiagonally) {
    //                             m[0] = 0;
    //                             m[1] = 1;
    //                             m[2] = 1;
    //                             m[3] = 0;
    //                         }
    //                         if (cell.flipped.horizontally) {
    //                             m[0] = -m[0];
    //                             m[2] = -m[2];
    //                         }
    //                         if (cell.flipped.vertically) {
    //                             m[1] = -m[1];
    //                             m[3] = -m[3];
    //                         }
    //                         var matrix = U.format("matrix({0}, {1}, {2}, {3}, 0, 0)", m[0], m[1], m[2], m[3]);
    //                         var dxMatrix = U.format(
    //                             "progid:DXImageTransform.Microsoft.Matrix(M11={0},M12={1},M21={2},M22={3},sizingMethod='auto expand')",
    //                             m[0], m[1], m[2], m[3]
    //                         );
    //                         ruleSet = [
    //                             "-moz-transform: " + matrix + ";",
    //                             "-o-transform: " + matrix + ";",
    //                             "-webkit-transform: " + matrix + ";",
    //                             "transform: " + matrix + ";",
    //                             '-ms-filter: "' + dxMatrix + '";',
    //                             "filter: " + dxMatrix + ";"
    //                         ].join(" ");
    //                         ruleSets[flippedClass] = ruleSet;
    //                     }

    //                     $("<div>", {
    //                         'id': 'tile-' + tn,
    //                         'class': classes.join(" "),
    //                         'style': U.format("left: {0}px; top: {1}px;",
    //                             i * cell.tile.bounds.w,
    //                             j * cell.tile.bounds.h
    //                         )
    //                     }).appendTo(canvas);

    //                     return true;
    //                 });
    //             });
    //             // Create the CSS classes.
    //             var styleSheet = [".tile { position: absolute; }"];
    //             $.each(ruleSets, function (key, value) {
    //                 styleSheet.push(U.format(".{0} { {1} }", key, value));
    //             });
    //             var style = $("<style>", { type: 'text/css' })
    //                 .html(styleSheet.join("\n"))
    //                 .appendTo($("head"));
    //         });
    //     })
    //     .fail(function () {
    //         alert("Failed to open TMX file.");
    //     });
});