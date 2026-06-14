## 基本概念
RNN、LSTM、GRU：从左往右一个一个走。1.并行度低；2.前面的信息容易在长序列的后面丢失
自回归：自己的输出有作为自己的输入，例如一个序列(y1, y2, ..., yt)，计算 yt 时，依赖 yt-1
layerNorm：对于序列数据一般存在三个维度：batch（样本数），sequence（序列本身），feature（单个词的向量长度），这仨构成一个长方体，batchNorm是说按照每次取出 batch * sequence的长方形，layerNorm是说每次取出 feature * sequence 的长方形