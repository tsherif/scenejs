
/** An attribute within a shader
 */
SceneJS._webgl.Attribute = function (gl, program, name, type, size, location) {

    this.gl = gl;
    this.location = location;

    this.bindFloatArrayBuffer = function (buffer) {
        if (buffer) {
            buffer.bind();
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, buffer.itemSize, buffer.itemType, buffer.normalize, 0, 0);   // Vertices are not homogeneous - no w-element
        }
    };
};

SceneJS._webgl.Attribute.prototype.bindInterleavedFloatArrayBuffer = function (components, stride, byteOffset) {
    this.gl.enableVertexAttribArray(this.location);
    this.gl.vertexAttribPointer(this.location, components, this.gl.FLOAT, false, stride, byteOffset);   // Vertices are not homogeneous - no w-element
};
