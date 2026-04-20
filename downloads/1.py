import numpy as np

# 激活函数：Sigmoid 及其导数
def sigmoid(x):
    return 1 / (1 + np.exp(-x))

def sigmoid_derivative(x):
    return x * (1 - x)

class BPNeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        # 随机初始化权重和偏置（遵循小数值原则）
        self.W1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))

    def forward(self, X):
        """前向传播"""
        self.z1 = np.dot(X, self.W1) + self.b1
        self.a1 = sigmoid(self.z1)          # 隐藏层输出
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        self.a2 = sigmoid(self.z2)          # 输出层预测值
        return self.a2

    def backward(self, X, y, output, lr=0.1):
        """反向传播与权重更新"""
        m = X.shape[0]  # 样本数量
        
        # 输出层误差（均方损失对z2的梯度简化形式）
        dZ2 = output - y
        dW2 = (1/m) * np.dot(self.a1.T, dZ2)
        db2 = (1/m) * np.sum(dZ2, axis=0, keepdims=True)
        
        # 隐藏层误差传递
        dA1 = np.dot(dZ2, self.W2.T)
        dZ1 = dA1 * sigmoid_derivative(self.a1)
        dW1 = (1/m) * np.dot(X.T, dZ1)
        db1 = (1/m) * np.sum(dZ1, axis=0, keepdims=True)
        
        # 梯度下降更新参数
        self.W2 -= lr * dW2
        self.b2 -= lr * db2
        self.W1 -= lr * dW1
        self.b1 -= lr * db1

    def train(self, X, y, epochs, lr=0.1):
        """训练循环"""
        for i in range(epochs):
            output = self.forward(X)
            loss = np.mean(np.square(y - output))
            
            if i % 2000 == 0:
                print(f"Epoch {i:5d} | Loss: {loss:.6f}")
                
            self.backward(X, y, output, lr)
        print("✅ 训练完成！\n")

# ================= 数据准备 =================
# XOR 数据集（非线性可分，必须含隐藏层才能解决）
X = np.array([[0, 0],
              [0, 1],
              [1, 0],
              [1, 1]], dtype=float)
y = np.array([[0],
              [1],
              [1],
              [0]], dtype=float)

# ================= 模型实例化与训练 =================
input_dim, hidden_dim, output_dim = 2, 4, 1
nn = BPNeuralNetwork(input_dim, hidden_dim, output_dim)
nn.train(X, y, epochs=8000, lr=0.5)

# ================= 测试预测 =================
print("🔍 最终预测结果：")
pred = nn.forward(X)
for i in range(len(X)):
    target = y[i][0]
    predict_val = pred[i][0]
    print(f"输入: {X[i]} → 预测: {predict_val:.4f} | 真实: {target}")

