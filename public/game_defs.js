

function loadAnimationFrames(mapObject) {
    mapObject.animations.add("left", [17,18, 19, 20, 21, 22, 23
        ], 15, true) ;
    mapObject.animations.add("right", [9, 10, 11, 12, 13, 14,
        15], 15, true);
    mapObject.animations.add("up", [1,2,3,4,5,6,7], 15, true);
    mapObject.animations.add("down", [25,26,27,28,29,30,31], 15, true);

    mapObject.animations.add("thrust_left", [17, 18],
        15, true);
    mapObject.animations.add("thrust_right", [9, 10], 15, true);
    mapObject.animations.add("thrust_up", [3, 4],
        15, true);
    mapObject.animations.add("thrust_down", [27, 28],
        15, true);
}

