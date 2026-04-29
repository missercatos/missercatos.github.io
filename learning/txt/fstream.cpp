//这里来简单说说我理解下的文件合流，算是我自己的看法和理解，建议在学过知识之后可以来看看。下面有学习网址。
//文件合流使用的fstream标准库含有（of/if)fstream三种数据类型，of用于写，if用于读，fstream兼备以上两种。
//文件合流的思路是，先定义一种方式（只读或者是只写）选择哪一种数据类型   
//然后打开文件void open(const char *filename,ios::openmode mode)，open函数是上面三种数据类型的成员函数。要先定义类。
//写入 or 读取文件  写入：(of)stream配合<<  读取：(if)stream配合>>      不再使用cout和cin
//关闭文件   void close()
//以上就是基本思路，剩下看下面实例。
#include<iostream>
#include<fstream>
using namespace std;
int main(){
  char data[100]; //这里我们定义一个数组含有100个元素
  ofstream outfile; //读写文件，定义一个outfile类
  outfile.open("afile.dat"); //打开文件，open是成员函数
  cout<<"Writing to the file" <<endl;
  cout<<"Enter your name:";
  cin.getline(data,100); //输入数据，这里cin.getline是一个整体，意思是读取一整行（包括空格）属于标准输入输出流的函数。
  outfile<<data<<endl; //注意这里，不是直接用ofstream或者是cout，而是用定义的fastream类
  cout<<"Enter your age";
  cin>>data;
  cin.ignore();  //cin.ignore也是一个整体，用于忽略下一个字符，如果想要定义可以cin.ignore(n,ch)忽略最多n个字符,直到ch
  outfile<<data<<endl;
  outfile.close(); //close()关闭文件
  ifstream infile; //下面使用只读操作，也是同样的思路
  infile.open("afile.dat");
  cout<<"Reading from the file"<<endl;
  infile >>data;
  cout<<data<<endl;
  infile>>data;
  cout<<data<<endl;
  infile.close();
  return 0;
}


//另外，这里还提供了两个进阶技巧
//1 --打开文件多种模式混合使用
//
/*ofstream outfile;
 * outfile.open("想要打开的文件",ios::out | ios::trunc)   用于想要写入的同时并希望截断文件。具体更多ios::模式标准可以参考图片信息
 
//2 --文件位置指针
//
// iostream提供了用于重新定义文件位置指针的成员函数   instream用seekg (get)  ofstram用seekp (put) 都是长整型参数
// 查找方向：ios::beg(开始位置,如果不定义则是默认的)ios::cur(当前位置)ios::end(结尾)
// 例子如下:
// a.seekg(n)    定位到第n个字节
// a.seekg(n,ios::cur)  从当前位置往后移n个字节
// a.seekg(n,ios::end)  从结尾往前移动n个字节
// a.seekg(0,ios::end)  直接定位到末尾
