
var BaseObject = require("./BaseObject");
var WebGLUtils = require("./webgl-utils");

var Renderer = module.exports = BaseObject.extend({
    _construct: function(){
        var canvas = document.getElementById("gameCanvas");
        this.initGL(canvas);
        var self = this;
        this.initShaders(function() {
            console.log("here");
            self.initBuffers();

            self.gl.clearColor(0.0, 0.0, 0.0, 1.0);
            self.render();
        });

    },
    initGL: function(canvas){
        try {
            this.gl = canvas.getContext("experimental-webgl");
            this.gl.viewportWidth = canvas.width;
            this.gl.viewportHeight = canvas.height;
        } catch (ex) {
        }
        if (!this.gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
        
    },
    setMatrixUniforms: function () {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    },
    initShaders: function(callback) {
        var self = this;
        $.get("/js/shader/fragment.js",function(fragmentShaderSource) {
            $.get("/js/shader/vertex.js",function(vertexShaderSoruce) {
                var fragmentShader = WebGLUtils.loadShader(self.gl, "x-shader/x-fragment",fragmentShaderSource);
                var vertexShader = WebGLUtils.loadShader(self.gl, "x-shader/x-vertex",vertexShaderSoruce);
            
                self.shaderProgram = self.gl.createProgram();
                self.gl.attachShader(self.shaderProgram, vertexShader);
                self.gl.attachShader(self.shaderProgram, fragmentShader);
                self.gl.linkProgram(self.shaderProgram);

                if (!self.gl.getProgramParameter(self.shaderProgram, self.gl.LINK_STATUS)) {
                    alert("Could not initialise shaders");
                }

                self.gl.useProgram(self.shaderProgram);

                self.shaderProgram.vertexPositionAttribute = self.gl.getAttribLocation(self.shaderProgram, "aVertexPosition");
                self.gl.enableVertexAttribArray(self.shaderProgram.vertexPositionAttribute);
                
                callback();
            },"text");
        },"text");
        
    },
    initBuffers: function(){
        this.squareVertexPositionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        var vertices = [
        1.0,  1.0,  0.0,
        -1.0,  1.0,  0.0,
        1.0, -1.0,  0.0,
        -1.0, -1.0,  0.0
        ];
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
        this.squareVertexPositionBuffer.itemSize = 3;
        this.squareVertexPositionBuffer.numItems = 4;
    },
    render: function(){
        this.gl.canvas.width  = window.innerWidth; 
        this.gl.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, window.innerWidth, window.innerHeight);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.squareVertexPositionBuffer);
        this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, this.squareVertexPositionBuffer.itemSize, this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.squareVertexPositionBuffer.numItems);
    }
});