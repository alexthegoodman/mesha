// prettier-ignore
export const vertices: Float32Array = new Float32Array([
    // Front face
    0.0,  1.0,  0.0,
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    // Right face
    0.0,  1.0,  0.0,
    1.0, -1.0,  1.0,
    1.0, -1.0, -1.0,
    // Back face
    0.0,  1.0,  0.0,
    1.0, -1.0, -1.0,
    -1.0, -1.0, -1.0,
    // Left face
    0.0,  1.0,  0.0,
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0
]);

// prettier-ignore
export const colors: Float32Array = new Float32Array([
    // front - blue
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,

    // right - red
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,

    // back - yellow
    1, 1, 0,
    1, 1, 0,
    1, 1, 0,

    // left - green
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
]);
