"use strict"
// ui functions
//SiplPen = window.SiplPen || {};
SiplPen.ui = (function () {

    // Base elements
    var body, article, uiContainer, overlay, header;

    // Buttons
    var screenSizeElement, colorLayoutElement, targetElement, saveElement;

    // Word Counter
    var wordCountValue, wordCountBox, wordCountElement, wordCounterProgress, counterBar;
    var counterBarUse = 0;

    //save support
    var supportsSave, saveFormat, textToWrite, saveModal;

    var expandScreenIcon = '<i class="fa fa-arrows-alt fa-fw" aria-hidden="true"></i>';
    var shrinkScreenIcon = '<i class="fa fa-compress fa-fw" aria-hidden="true"></i>';

    // flowstateMode
    var flowstateMode = false;
    var strictFlow = false;
    var flowstateBox, flowstateFailBox, timeCounterProgress, flowingBox;
    var total_set, expiring_set, total_time, expiring_time, total_id, expiring_id, alpha_step;

    // timing
    var timeCounterProgress;

    //Settings and info
    var settingBox, infoBox, fontProgress;

    function init() {

        supportsSave = !!new Blob() ? true : false;

        bindElements();
        loadSettingItems();
        SiplPen.translater.init();

        //var wordCountActive = false;

        if (SiplPen.util.supportsHtmlStorage()) {
            loadState();
        }
        console.log(SiplPen.translater.getTran("consoleText1"));
    }

    function loadState() {

        // Activate word counter
        if (localStorage['wordCount'] && localStorage['wordCount'] !== "0") {
            wordCountValue = parseInt(localStorage['wordCount']);
            wordCountElement.value = localStorage['wordCount'];
            //wordCounter.className = "counter-bar active";
            //activeWordCount();
            //updateWordCount();
            setWordCount(parseInt(localStorage['wordCount']));
            updateWordCount();
        }

        // Activate color switch
        if (localStorage['darkLayout'] === 'true') {
            document.body.className = 'yin';
        }
    }

    function saveState() {
        if (SiplPen.util.supportsHtmlStorage()) {
            localStorage['wordCount'] = wordCountElement.value;
        }
    }

    function bindElements() { //MARK:bind

        // Body element for light/dark styles
        body = document.body;

        uiContainer = document.querySelector('.ui');

        // UI element for color flip
        colorLayoutElement = document.querySelector('.color-flip');
        colorLayoutElement.onclick = onColorLayoutClick;

        // UI element for full screen		
        screenSizeElement = document.querySelector('.fullscreen');
        screenSizeElement.onclick = onScreenSizeClick;

        targetElement = document.querySelector('.target ');
        targetElement.onclick = onTargetClick;

        //UI element for settings and about
        targetElement = document.querySelector('.infobtn ');
        targetElement.onclick = onInfoClick;
        targetElement = document.querySelector('.settingbtn ');
        targetElement.onclick = onSettingsClick;


        // UI element for flowstate Mode
        targetElement = document.querySelector('.flowstate ');
        targetElement.onclick = onFlowstateClick;
        targetElement = document.querySelector('.startflow');
        targetElement.onclick = function () {
            total_set = document.getElementsByName('total_time')[0].value * 60;
            expiring_set = document.getElementsByName('expiring_time')[0].value * 10;
            total_time = total_set;
            expiring_time = expiring_set;
            alpha_step = 1 / expiring_time;
            enterFlowstateMode();
            removeOverlay();
        };

        //init event listeners only if browser can save
        if (supportsSave) {

            saveElement = document.querySelector('.save');
            saveElement.onclick = onSaveClick;

            var formatSelectors = document.querySelectorAll('.saveselection span');
            for (var i = 0, len = formatSelectors.length; i < len; i++) {
                formatSelectors[i].onclick = selectFormat;
            }

            document.querySelector('.savebutton').onclick = saveText;
        } else {
            document.querySelector('.save.useicons').style.display = "none";
        }

        // Overlay when modals are active
        overlay = document.querySelector('.overlay');
        overlay.onclick = onOverlayClick;

        article = document.querySelector('.content');
        article.onkeyup = onArticleKeyUp;

        wordCountBox = overlay.querySelector('.wordcount');
        wordCountElement = wordCountBox.querySelector('input');
        wordCountElement.onchange = onWordCountChange;
        wordCountElement.onkeyup = onWordCountKeyUp;

        saveModal = overlay.querySelector('.saveoverlay');

        counterBar = document.querySelector('.counter-bar');
        wordCounterProgress = counterBar.querySelector('.word-progress');

        flowstateBox = overlay.querySelector('.flowsettings');
        flowstateFailBox = overlay.querySelector('.flowfailure');

        timeCounterProgress = counterBar.querySelector('.time-progress');
        flowingBox = overlay.querySelector('.flowing');

        settingBox = overlay.querySelector('.settings');
        infoBox = overlay.querySelector('.info');

        fontProgress = counterBar.querySelector('.font-progress');

        header = document.querySelector('.header');
        header.onkeypress = onHeaderKeyPress;
    }

    function onScreenSizeClick(event) {

        screenfull.toggle();
        if (screenfull.enabled) {
            document.addEventListener(screenfull.raw.fullscreenchange, function () {
                if (screenfull.isFullscreen) {
                    screenSizeElement.innerHTML = shrinkScreenIcon;
                } else {
                    screenSizeElement.innerHTML = expandScreenIcon;
                }
            });
        }
    };

    function onColorLayoutClick(event) {
        if (localStorage["darkLayout"] === 'true') {
            document.body.classList.remove('yin');
            document.body.classList.add('yang');
            localStorage["darkLayout"] = false;
        } else {
            document.body.classList.remove('yang');
            document.body.classList.add('yin');
            localStorage["darkLayout"] = true;
        };
    }

    function onTargetClick(event) {
        SiplPen.util.fadeIn(overlay);
        //overlay.style.display="block";
        SiplPen.util.fadeIn(wordCountBox);
        wordCountElement.focus();
    }

    function onSaveClick(event) {
        if (flowstateMode === false) {
            SiplPen.util.fadeIn(overlay);
            SiplPen.util.fadeIn(saveModal);
        } else {
            SiplPen.util.fadeIn(overlay);
            SiplPen.util.fadeIn(flowingBox);
        }
    }

    function onInfoClick(event) {
        var t = document.getElementById("wordcountinfo");
        t.innerText = SiplPen.editor.getWordCount();
        SiplPen.util.fadeIn(overlay);
        SiplPen.util.fadeIn(infoBox);
    }

    function onSettingsClick(event) {
        checkSettingItems();
        SiplPen.util.fadeIn(overlay);
        SiplPen.util.fadeIn(settingBox);
    }

    function onFlowstateClick(event) {
        if (flowstateMode === false) {
            SiplPen.util.fadeIn(overlay);
            SiplPen.util.fadeIn(flowstateBox);
            //overlay.style.display = "block";
            //flowstateBox.style.display = "block";
            //SiplPen.editor.enterFlowstateMode ();
        } else {
            SiplPen.util.fadeIn(overlay);
            SiplPen.util.fadeIn(flowingBox);
        }
    }

    function saveText(event) {

        if (typeof saveFormat != 'undefined' && saveFormat != '') {
            var blob = new Blob([textToWrite], {
                type: "text/plain;charset=utf-8"
            });
            /* remove tabs and line breaks from header */
            var headerText = header.innerHTML.replace(/(\t|\n|\r)/gm, "");
            if (headerText === "") {
                headerText = "SiplPen";
            }
            saveAs(blob, headerText + '.txt');
        } else {
            document.querySelector('.saveoverlay h1').style.color = '#FC1E1E';
        }
    }

    /* Allows the user to press enter to tab from the title */
    function onHeaderKeyPress(event) {

        if (event.keyCode === 13) {
            event.preventDefault();
            article.focus();
        }
    }

    /* Allows the user to press enter to tab from the word count modal */
    function onWordCountKeyUp(event) {

        if (event.keyCode === 13) {
            event.preventDefault();

            setWordCount(parseInt(this.value));

            removeOverlay();

            article.focus();
        }
    }

    function onWordCountChange(event) {

        setWordCount(parseInt(this.value));
    }

    function claimCount() {
        counterBarUse += 1;
        counterBar.className = "counter-bar active";
    }

    function unclaimCount() {
        counterBarUse -= 1;
        if (counterBarUse <= 0) {
            counterBar.className = "counter-bar";
        }
    }

    function setWordCount(count) {

        // Set wordcount ui to active
        if (count > 0) {

            wordCountValue = count;
            claimCount();
            //wordCounter.className = "counter-bar active";
            updateWordCount();

        } else {

            wordCountValue = 0;
            wordCounterProgress.style.width = 0;
            unclaimCount();
            //wordCounter.className = "counter-bar";
        }

        saveState();
    }

    function onArticleKeyUp(event) {

        if (wordCountValue > 0) {
            updateWordCount();
        }
    }

    function updateWordCount() {

        var wordCount = SiplPen.editor.getWordCount();
        var percentageComplete = wordCount / wordCountValue;
        wordCounterProgress.style.width = percentageComplete * 100 + '%';

        if (percentageComplete >= 1) {
            wordCounterProgress.className = "word-progress progress complete";
        } else {
            wordCounterProgress.className = "word-progress progress";
        }
    }

    function selectFormat(e) {

        if (document.querySelectorAll('span.activesave').length > 0) {
            document.querySelector('span.activesave').className = '';
        }

        document.querySelector('.saveoverlay h1').style.cssText = '';

        var targ;
        if (!e) var e = window.event;
        if (e.target) targ = e.target;
        else if (e.srcElement) targ = e.srcElement;

        // defeat Safari bug
        if (targ.nodeType == 3) {
            targ = targ.parentNode;
        }

        targ.className = 'activesave';

        saveFormat = targ.getAttribute('data-format');

        var header = document.querySelector('header.header');
        var headerText = header.innerHTML.replace(/(\r\n|\n|\r)/gm, "") + "\n";

        var body = document.querySelector('article.content');
        var bodyText = body.innerHTML;

        textToWrite = formatText(saveFormat, headerText, bodyText);

        var textArea = document.querySelector('.hiddentextbox');
        textArea.value = textToWrite;
        textArea.focus();
        textArea.select();

    }

    function formatText(type, header, body) {

        var text;
        switch (type) {

            case 'html':
                header = "<h1>" + header + "</h1>";
                text = header + body;
                text = text.replace(/\t/g, '');
                break;

            case 'markdown':
                header = header.replace(/\t/g, '');
                header = header.replace(/\n$/, '');
                header = "#" + header + "#";

                text = body.replace(/\t/g, '');

                text = text.replace(/<b>|<\/b>/g, "**")
                    .replace(/\r\n+|\r+|\n+|\t+/ig, "")
                    .replace(/<i>|<\/i>/g, "_")
                    .replace(/<blockquote>/g, "> ")
                    .replace(/<\/blockquote>/g, "")
                    .replace(/<p>|<\/p>/gi, "\n")
                    .replace(/<br>/g, "\n");

                var links = text.match(/<a href="(.+)">(.+)<\/a>/gi);

                if (links !== null) {
                    for (var i = 0; i < links.length; i++) {
                        var tmpparent = document.createElement('div');
                        tmpparent.innerHTML = links[i];

                        var tmp = tmpparent.firstChild;

                        var href = tmp.getAttribute('href');
                        var linktext = tmp.textContent || tmp.innerText || "";

                        text = text.replace(links[i], '[' + linktext + '](' + href + ')');
                    }
                }

                text = header + "\n\n" + text;
                break;

            case 'plain':
                header = header.replace(/\t/g, '');

                var tmp = document.createElement('div');
                tmp.innerHTML = body;
                text = tmp.textContent || tmp.innerText || "";

                text = text.replace(/\t/g, '')
                    .replace(/\n{3}/g, "\n")
                    .replace(/\n/, ""); //replace the opening line break

                text = header + text;
                break;
            default:
                break;
        }

        return text;
    }

    function onOverlayClick(event) {

        if (event.target.className === "overlay") {
            removeOverlay();
        }
    }

    function removeOverlay() {
        SiplPen.util.fadeOut(overlay);
        //overlay.style.display = "none";
        setTimeout(function () {
            //wordCountBox.style.display = "none";
            //descriptionModal.style.display = "none";
            //flowstateFailBox.style.display="none";
            //saveModal.style.display = "none";
            //flowstateBox.style.display= "none"
            var childs = overlay.getElementsByClassName('modal');
            for (var i = childs.length - 1; i >= 0; i--) {
                childs[i].style.display = "none";
            }
            document.querySelector('.finishsummary ').style.display = "none";
        }, 500);


        if (document.querySelectorAll('span.activesave').length > 0) {
            document.querySelector('span.activesave').className = '';
        }
        saveFormat = '';
    }

    function disableCopy() {
        window.oncontextmenu = function (e) {
            e.preventDefault();
        }
        document.body.oncopy = function () {
            return false;
        }
    }

    function enableCopy() {
        window.oncontextmenu = null;
        document.body.oncopy = null;
    }

    function enterFlowstateMode() {
        if (strictFlow === true) {
            console.info('Strict Mode is enabled');
            SiplPen.editor.startStrictFlow();
            disableCopy();
        }
        console.info("Starting flowstate mode: " + total_time + " , " + expiring_time + " , " + alpha_step);
        resetOpacity();
        targetElement = document.querySelector('.content');
        targetElement.oninput = function () {
            expiring_time = expiring_set;
            resetOpacity();
        };
        total_id = setInterval(count_total_down, 1000);
        expiring_id = setInterval(count_exp_down, 100);
        flowstateMode = true;
        claimCount();
        timeCounterProgress.style.transition = "width " + total_set + "s";
        timeCounterProgress.style.transitionTimingFunction = "linear";
        timeCounterProgress.style.width = "100%"
    }

    function count_total_down() {
        if (total_time > 0) {
            total_time = total_time - 1;
            //updateTimeCount();
        } else {
            console.info("Flowstate mode completed");
            flowCompleted();
        }
    }

    function count_exp_down() {
        if (expiring_time > 0) {
            expiring_time = expiring_time - 1;
            document.getElementsByClassName("content")[0].style.opacity = document.getElementsByClassName("content")[0].style.opacity - alpha_step;
        } else {
            console.info('Flowstate ended in failure');
            SiplPen.editor.cls();
            flowCleanWork();
            SiplPen.util.fadeIn(overlay);
            SiplPen.util.fadeIn(flowstateFailBox);
        }
    }


    function resetOpacity() {
        document.getElementsByClassName("content")[0].style.opacity = 1;
    }

    function flowCleanWork() {
        clearInterval(total_id);
        clearInterval(expiring_id);
        resetOpacity();
        unclaimCount();
        enableCopy();
        SiplPen.editor.finishStrictFlow();
        timeCounterProgress.style.transition = "";
        timeCounterProgress.style.width = "0px";
        flowstateMode = false;
    }

    function flowCompleted() {
        flowCleanWork();
        SiplPen.util.fadeIn(overlay);
        SiplPen.util.fadeIn(saveModal);
        targetElement = document.querySelector('.finishsummary ');
        targetElement.innerHTML = targetElement.innerHTML.replace("{s}", total_set / 60);
        targetElement.style.display = "block";
    }

    //Settings function 
    //MARK:settings
    function loadSettingItems() {
        //font
        if (localStorage.getItem('src_font') === "true") {
            document.querySelector('body').classList.add("src-font");
        } else if (localStorage.getItem('src_font') === "false") {
            document.querySelector('body').classList.remove("src-font");
        }
        //strictFlow
        if (localStorage.getItem('strict_flow') === "true") {
            strictFlow = true;
        } else if (localStorage.getItem('strict_flow') === "false") {
            strictFlow = false;
        }
        document.querySelector('article').spellcheck = localStorage['spell_check'];
        //
        if (localStorage.getItem('spell_check') === "true") {
            document.querySelector('article').spellcheck = true;
        } else if (localStorage.getItem('strict_flow') === "false") {
            document.querySelector('article').spellcheck = false;
        } else {
            localStorage['spell_check'] = false;
            document.querySelector('article').spellcheck = false;
        }
    }

    function checkSettingItems() {
        //lang
        if (window.location.search.indexOf("lang=") != -1) {
            document.getElementById('langarginform').style.display = "block";
        }
        //font
        if (localStorage.getItem('src_font') === "true") {
            document.querySelector('#toggleFont i').className = 'fa fa-fw fa-check-square-o';
        } else if (localStorage.getItem('src_font') === "false") {
            document.querySelector('#toggleFont i').className = 'fa fa-fw fa-square-o';
        } else {
            localStorage['src_font'] = false;
        }
        //strict
        if (localStorage.getItem('strict_flow') === "true") {
            document.querySelector('#toggleStrict i').className = 'fa fa-fw fa-check-square-o';
        } else if (localStorage.getItem('strict_flow') === "false") {
            document.querySelector('#toggleStrict i').className = 'fa fa-fw fa-square-o';
        } else {
            localStorage['strict_flow'] = false;
        }
        //spell check
        if (localStorage.getItem('spell_check') === "true") {
            document.querySelector('#toggleSpellCheck i').className = 'fa fa-fw fa-check-square-o';
        } else if (localStorage.getItem('strict_flow') === "false") {
            document.querySelector('#toggleSpellCheck i').className = 'fa fa-fw fa-square-o';
        } else {
            localStorage['spell_check'] = false;
        }

    }

    function s_toggleSpellCheck() {
        if (localStorage['spell_check'] === "true") {
            localStorage['spell_check'] = false;
            document.querySelector('article').spellcheck = false;
        } else if (localStorage['spell_check'] === "false") {
            localStorage['spell_check'] = true;
            document.querySelector('article').spellcheck = true;
        } else {
            alert(alertContent1);
        }
        checkSettingItems();
    }

    function s_toggleStrict() {
        if (localStorage.getItem('strict_flow') === "true") {
            localStorage['strict_flow'] = false;
            strictFlow = false;
        } else if (localStorage.getItem('strict_flow') === "false") {
            localStorage['strict_flow'] = true;
            strictFlow = true;
        } else {
            alert(alertContent1);
        }
        checkSettingItems();
    }


    function s_cleanLocalStorage() {
        if (confirm(SiplPen.translater.getTran('confirmContent1')) === true) {
            var lang = localStorage["t-lang"];
            localStorage.clear();
            localStorage["t-lang"] = lang;
            window.location.reload();
        }
    }

    function s_toggleFont() {
        if (localStorage['src_font'] === 'false') {
            document.querySelector('body').classList.add("src-font");
            localStorage['src_font'] = true;
            var a = setTimeout(function () {
                document.getElementById('spanfontloading').style.display = 'inline';
            }, 100);
            claimCount();
            var t = 0;
            if (t === 0) {
                fontProgress.style.marginLeft = window.innerWidth + "px";
                t = 1
            } else {
                fontProgress.style.marginLeft = "-33px";
                t = 0
            }
            var pid = setInterval(function () {
                if (t === 0) {
                    fontProgress.style.marginLeft = window.innerWidth + "px";
                    t = 1
                } else {
                    fontProgress.style.marginLeft = "-33px";
                    t = 0
                }

            }, 5000);
            var font = new FontFaceObserver('SourceHanSerifWeb');
            font.load(null, 100000).then(function () {
                clearInterval(pid);
                clearTimeout(a);
                unclaimCount();
                setTimeout(function () {
                    document.getElementById('spanfontloading').style.display = 'none';
                }, 1000);
                fontProgress.style.marginLeft = "-33px";
                console.log('Font is available');
            }, function () {
                unclaimCount();
                setTimeout(function () {
                    document.getElementById('spanfontloading').style.display = 'none';
                    document.getElementById('spanfontfailed').style.display = 'inline';
                }, 1000);
                console.log('Font is not available');
                clearInterval(pid);
                fontProgress.style.marginLeft = "-33px";
                clearTimeout(a);
            });

        } else if (localStorage['src_font'] === 'true') {
            document.querySelector('body').classList.remove("src-font");
            localStorage['src_font'] = false;
        } else {
            alert(alertContent1);
        }
        checkSettingItems();
    }

    return {
        init: init,
        //Debug:
        flowCompleted: flowCompleted,
        unclaimCount: unclaimCount,
        //settings
        s_cleanLocalStorage: s_cleanLocalStorage,
        s_toggleFont: s_toggleFont,
        s_toggleStrict: s_toggleStrict,
        s_toggleSpellCheck: s_toggleSpellCheck,
    }

})();