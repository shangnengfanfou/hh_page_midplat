# pc应用录屏并推流到rtmp流媒体服务器
## 工具
ffmpeg 、c#
## 原理介绍
整个原理其实是比较简单的，截频录屏、推流的整个行为，都是由ffmpeg实现的。通过c#的process类调用ffmpeg进程，使用相关命令行参数实现推流。这里并不涉及ffmepg源码在untiy中的使用，只是对windows中打包好ffmpeg工具的调用。
关于播放器拉流播放的问题，并不局限于unity，只要是可以播放rtmp流的播放器都可以使用，在unity中，也有多种可以播放rtmp的播放器，这里推荐一个：UMP(UniversalMediaPlayer)
## windows ffmpeg工具
官网下载ffmpeg windows工具
下载地址：[https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z](https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-full.7z)
可以看到bin文件夹中有三个文件：见下图
![image.png](http://127.0.0.1:8090/views/img/1658302192_02e658e74346d58d.png){{{width="600px" height="auto"}}}
将bin文件夹拷贝到unity的StreamingAssets文件夹，并将文件夹改名为ffmpeg
这里介绍下三个文件
```
ffmpeg.exe: 多媒体文件或者流的采集、处理、转换工具
ffplay.exe: 多媒体文件或者流播放器
ffprobe.exe: 获取多媒体文件或者流的信息，并可以进行输出
```
## unity调用ffmpeg
### process类调用ffmpeg.exe前准备工作
```
//拼装ffmpeg.exe的位置
private string _ffpath;
_ffpath = Application.streamingAssetsPath + @"/ffmpeg/ffmpeg.exe";
//拼装ffmepg录制应用画面需要的参数
private string _ffargs;
/*
可以看到FFARGS_GDIGRAB有7个变量；
gdigrab是FFmpeg用于抓取Windows桌面的设备（虚拟设备），可以用于录制屏幕。支持两种方式的抓取：
（1）“desktop”：抓取整张桌面。或者抓取桌面中的一个特定的区域。
（2）“title={窗口名称}”：抓取屏幕中特定的一个窗口（目前中文窗口还有乱码问题）。
*/
private string FFARGS_GDIGRAB = "-f gdigrab -i title={0} -c:v libx264 -preset ultrafast -rtbufsize 2000k -b:v {1} -r {2} -s {3} -f flv rtmp://{4}:{5}/live/{6}";
/*
介绍下ffmpeg gdigrab的参数
title：被录制的应用名（中文可能出现乱码）unity中使用Application.productName获取
-b：码率 (:v 指视频 :a 指音频)
-r: 帧率
-s：分辨率 
{4}，{5}，{6}分别指推流的ip、端口已经流的名称
*/
public string b = "1500k";
public string r = "30";
public string s = "800x600";
public string IP = "127.0.0.1";
public int port = 1935;
public string steamName = "test";
_ffargs = string.Format(FFARGS_GDIGRAB, Application.productName, b, r, s, IP.Trim(), port.toString(), steamName);

```
### 使用process类调用ffmpeg并传入参数
```
//不一定要使用协程   
 private IEnumerator IERecording()
    {
        string appName = Application.productName;
        yield return null;
        Loom.RunAsync(() =>
        {
            Process ffp = new Process();
            ffp.StartInfo.FileName = _ffpath;  //进程可执行文件位置     
            UnityEngine.Debug.Log("FFRecorder::StartRecording - 执行命令：" + _ffpath + " " + _ffargs);
            ffp.StartInfo.Arguments = _ffargs; //传给可执行文件的命令行参数
            ffp.StartInfo.CreateNoWindow = !_debug; // 是否显示控制台窗口
            ffp.StartInfo.UseShellExecute = false;//是否使用操作系统Shell程序启动进程
            ffp.StartInfo.RedirectStandardInput = true;
            ffp.StartInfo.RedirectStandardOutput = true;
            ffp.StartInfo.RedirectStandardError = true;
            ffp.Start();     // 开始进程
            ffp.StandardInput.WriteLine();
            //ffp.BeginErrorReadLine();//开始异步读取
            _pid = ffp.Id;
            _isRecording = true;
        });
    }
```
### Loom类线程管理
代码如下
```
using UnityEngine; 
using System.Collections.Generic;
using System;
using System.Threading;
using System.Linq;
/// <summary>
/// 多线程
/// </summary>
public class Loom : MonoBehaviour
{
    public static int maxThreads = 8;
    static int numThreads;


    private static Loom _current;
    public static Loom Current
    {
        get
        {
            Initialize();
            return _current;
        }
    }
    //####去除Awake
    //  void Awake()  
    //  {  
    //      _current = this;  
    //      initialized = true;  
    //  }  


    static bool initialized;


    /// <summary>
    /// ####作为初始化方法自己调用，可在初始化场景调用一次即可
    /// </summary>
    public static void Initialize()
    {
        if (!initialized)
        {


            if (!Application.isPlaying)
                return;
            initialized = true;
            GameObject g = new GameObject("Loom");
            //####永不销毁
            DontDestroyOnLoad(g);
            _current = g.AddComponent<Loom>();
        }


    }


    private List<Action> _actions = new List<Action>();
    public struct DelayedQueueItem
    {
        public float time;
        public Action action;
    }
    private List<DelayedQueueItem> _delayed = new List<DelayedQueueItem>();


    List<DelayedQueueItem> _currentDelayed = new List<DelayedQueueItem>();
    /// <summary>
    /// 在主线程中运行
    /// </summary>
    /// <param name="action"></param>
    public static void QueueOnMainThread(Action action)
    {
        QueueOnMainThread(action, 0f);
    }
    public static void QueueOnMainThread(Action action, float time)
    {
        if (time != 0)
        {
            if (Current != null)
            {
                lock (Current._delayed)
                {
                    Current._delayed.Add(new DelayedQueueItem { time = Time.time + time, action = action });
                }
            }
        }
        else
        {
            if (Current != null)
            {
                lock (Current._actions)
                {
                    Current._actions.Add(action);
                }
            }
        }
    }


    public static Thread RunAsync(Action a)
    {
        Initialize();
        while (numThreads >= maxThreads)
        {
            Thread.Sleep(1);
        }
        Interlocked.Increment(ref numThreads);
        ThreadPool.QueueUserWorkItem(RunAction, a);
        return null;
    }

    private static void RunAction(object action)
    {
        try
        {
            ((Action)action)();
        }
        catch
        {
        }
        finally
        {
            Interlocked.Decrement(ref numThreads);
        }


    }

    void OnDisable()
    {
        if (_current == this)
        {


            _current = null;
        }
    }

    // Use this for initialization  
    void Start()
    {


    }


    List<Action> _currentActions = new List<Action>();


    // Update is called once per frame  
    void Update()
    {
        lock (_actions)
        {
            _currentActions.Clear();
            _currentActions.AddRange(_actions);
            _actions.Clear();
        }
        foreach (var a in _currentActions)
        {
            a();
        }
        lock (_delayed)
        {
            _currentDelayed.Clear();
            _currentDelayed.AddRange(_delayed.Where(d => d.time <= Time.time));
            foreach (var item in _currentDelayed)
                _delayed.Remove(item);
        }
        foreach (var delayed in _currentDelayed)
        {
            delayed.action();
        } 
    }
} 
```

