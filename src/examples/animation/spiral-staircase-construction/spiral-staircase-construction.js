/**
 * SceneJS Example - Procedural generation of a spiral staircase
 *
 * Lindsay Kay
 * lindsay.stanley.kay AT gmail.com
 * January 2010
 *
 * This spiral staircase is generated by rotating and translating a flattened
 * cube in a loop. The loop, with varying rotation and translation parameters
 * in each iteration, is effected by a generator node.
 *
 * A generator node's job is to generate a dynamic scope obect containing data for
 * sub-nodes. See how its first parameter is a function to generate that scope
 * object. During a scene traversal, SceneJS will loop at that node. In each loop,
 * SceneJS calls the function, sets the scope and traverses the subtree, stopping
 * its loop as soon as the function result is undefined. Our generator causes four
 * loops, where in each one it sets a scope containing different extents for its
 * child viewport node. It stops the loop by not returning anything.
 */
with (SceneJs) {
    var exampleScene = scene({}, // node always has a config object

            renderer({
                canvasId: 'mycanvas',
                clearColor : { r:0, g:0, b:0.0, a: 1 },
                viewport:{ x : 1, y : 1, width: 600, height: 600}  ,
                clear : { depth : true, color : true}
            },
                    shader({ type: 'simple-shader' },

                            lights({
                                lights: [
                                    {
                                        pos: { x: 100.0, y: 40.0, z: 0.0 }
                                    }
                                ]},
                                    perspective({ fovy : 45.0, aspect : 1.0, near : 0.10, far : 300.0
                                    },
                                            scalarInterpolator({
                                                type:"linear",
                                                input:"alpha",
                                                output:"eyez",
                                                keys: [0.0, 0.3, 1.0],
                                                values: [-50, -20, 60]
                                            },
                                                    scalarInterpolator({
                                                        type:"linear",
                                                        input:"alpha",
                                                        output:"eyex",
                                                        keys: [0.0,  0.3, 1.0],
                                                        values: [-50, 60, 0]
                                                    },
                                                            lookAt(function(scope) {
                                                                return {

                                                                    eye : { x: scope.get("eyex"), y: 5.0, z: scope.get("eyez")},
                                                                    look : { x : 0.0, y : .0, z : 0 },
                                                                    up : { x: 0.0, y: 1.0, z: 0.0 }
                                                                };
                                                            },
                                                                    material({
                                                                        ambient:  { r:0.6, g:0.6, b:0.6 },
                                                                        diffuse:  { r:0.7, g:0.7, b:0.9 }
                                                                    },
                                                                            generator(
                                                                                    (function() {
                                                                                        var elems = [];

                                                                                        for (var i = -24; i < 24; i += 5) {
                                                                                            for (var i2 = -25; i2 < 25; i2 += 5) {
                                                                                                var height = (Math.random() * 50.0) - 25;
                                                                                                elems.push({
                                                                                                    x: i,

                                                                                                    y: -(height ),
                                                                                                    z: i2,

                                                                                                    height:height
                                                                                                });
                                                                                            }
                                                                                        }
                                                                                        var j = 0;
                                                                                        return function() {
                                                                                            if (j < elems.length) {
                                                                                                return { param: elems[j++] };
                                                                                            } else {
                                                                                                j = 0;
                                                                                            }
                                                                                        };
                                                                                    })(),
                                                                                    translate(function(scope) {
                                                                                        return scope.get("param");
                                                                                    },
                                                                                            scale(function(scope) {
                                                                                                return  {y: scope.get("param.height")}
                                                                                            },

                                                                                                    objects.cube()
                                                                                                    )
                                                                                            )
                                                                                    )
                                                                            )
                                                                    )
                                                            )

                                                    ) // frustum
                                            ) // lights
                                    ) // shader
                            ) 
                    )
            );
    var alpha = 0;
    var p;

    function doit() {
        if (alpha > 10) {
            exampleScene.destroy();
            clearInterval(p);
        }

        alpha += 0.003;
        try {
            exampleScene.render({"alpha":alpha});
        } catch (e) {
            if (e.message) {
                alert(e.message);
            } else {
                alert(e);
            }
            throw e;
        }
    }

    /* Hack to get any scene definition exceptions up front.
     * Chrome seemed to absorb them in setInterval!
     */
    exampleScene.render({"alpha":alpha});

    /* Continue animation
     */
    pInterval = setInterval("doit()", 10);
}

