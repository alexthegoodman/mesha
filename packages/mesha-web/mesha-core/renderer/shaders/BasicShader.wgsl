struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) Color : vec4<f32>
}

@vertex
fn main_vertex(input : Vertex) -> VertexOutput {
    var output : VertexOutput;
    output.Position = input.Position;
    output.Color = input.Color;
    return output;
}

@fragment
fn main_fragment(input : VertexOutput) -> @location(0) Color : vec4<f32> {
    return input.Color;
}