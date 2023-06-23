// struct Uniforms {
//     mvpMatrices : array<mat4x4<f32>>
// }
// @binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct ObjectData {
    mvpMatrices : array<mat4x4<f32>>
}
@binding(0) @group(0) var<storage, read> objects : ObjectData;

struct Vertex {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
}

@vertex
fn main_vertex(
    @builtin(instance_index) instanceIndex: u32,
    @location(0) vertexPosition: vec4<f32>, 
    @location(1) vertexColor: vec4<f32>) -> Vertex {
    var output : Vertex;
    output.Position = objects.mvpMatrices[instanceIndex] * vertexPosition;
    output.Color = vertexColor;
    return output;
}

@fragment
fn main_fragment(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {
    return Color;
}