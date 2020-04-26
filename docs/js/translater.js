"use strict";SiplPen.translater=function(){var t,e=new Translater;function n(e){"cn"==e?((t=new Map).set("defaultTitle","简笔"),t.set("defaultContent",'<p>一个极简的写作区域。这里可以阻挡所有的干扰，并让您专注于重要的事情——写作！</p>\n\t\t\t<p>首先，你只需要删除这段文字（只需Ctrl+A选中并按下Del键），然后用你自己的精彩词汇填充页面。标题也可以自由修改。</p>\n\t\t\t<p>只需选中文本，并点击上方出现的小选项框，\n\t\t\t就可以使用<b>粗体</b>、<i>斜体</i>、<b><i>粗斜体</i></b>还有<a href="https://imbearchild.github.io/SiplPen/index.html?lang=cn">链接</a>。</p>\n\t\t\t<blockquote>引用也很容易添加！</blockquote>\n\t\t\t<p>页面的左侧是本软件的菜单栏，您可以使用该处的按钮设置全屏、切换主题、设置目标字数、保存文字以及启动心流模式。</p>\n\t\t\t<p>如果您觉得默认字体显示效果不尽人意，您可以使用左下角的齿轮按钮打开设置界面进行调整。</p>\n\t\t\t<p>随着心流模式的加入，你可以更加专注于写作。</p><p>现在就点击右侧的双箭头试一试吧。</p>'),t.set("alertContent1","发生内部错误。\n因储存的数据与程序逻辑不一致，此设置项暂不可用。\n要修复此问题请保存您的文档，并使用设置项“清除所有用户数据”来重设数据。"),t.set("confirmContent1","所有除了语言设置外用户数据都将被清除。您确定要继续吗？"),t.set("alertContent2","发生内部错误。您的浏览器不支持我们使用的接口。粘贴功能暂不可用。"),t.set("consoleText1","如果你喜欢该项目，请在GitHub上给我一个Star！(https://github.com/ImBearChild/SiplPen)"),document.title="简笔",document.lang="zh-CN"):((t=new Map).set("defaultTitle","This is Siplpen"),t.set("defaultContent",'<p>A minimalist writing zone, where you can block out all distractions and get to what\'s important. The writing!  \n\t\t\t</p>\n\t\t\t<p>\n\t\t\tTo get started, all you need to do is delete this text (seriously, just highlight it and hit delete), and fill the page with your own fantastic words. You can even change the title! \n\t\t\t</p>\n\t\t\t<p>You can use <b>bold</b>, <i>italics</i>, <b><i>both</i></b> and <a href="https://imbearchild.github.io/SiplPen/index.html"> urls </a> just by highlighting the text and selecting them from the tiny options box that appears above it.\n\t\t\t</p><blockquote>Quotes are easy to add too!\n\t\t\t</blockquote><p>\n\t\t\tAnd with the addition of flowstate mode, you can focus on writing more deeply.</p>\t\t\t<p>This is the most dangerous function of this application. You have to keep writing, or everything will be erased if you stop beyond the expiring time.\n\t\t\t</p>'),t.set("alertContent1",'An internal error has occurred. Please save your document and use "Clean ALL user data." item to reset data.'),t.set("confirmContent1","All user data except language setting will be deleted. Are you sure to continue?"),t.set("alertContent2","An internal error has occurred. Your browser dose NOT supprot this application. "),t.set("consoleText1","If you like this project, please consider giving me a star on github! (https://github.com/ImBearChild/SiplPen)"),document.title="Siplpen",document.lang="en")}function i(){return e.getLang()}function o(t){n(t),e.setLang(t)}return{init:function(){localStorage["t-lang"]?n(i()):"zh-CN"==window.navigator.language?o("cn"):n(i())},getLang:i,setLang:o,getTran:function(e){return t.get(e)},getTranObj:function(){return e}}}();