struct Vertex {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
}

@vertex
fn main_vertex(@location(0) vertexPosition: vec2<f32>, @location(1) vertexColor: vec3<f32>) -> Vertex {
    var output : Vertex;
    output.Position = vec4<f32>(vertexPosition, 0.0, 1.0);
    output.Color = vec4<f32>(vertexColor, 1.0);
    return output;
}

@fragment
fn main_fragment(@location(0) Color: vec4<f32>) -> @location(0) vec4<f32> {
    return Color;
}