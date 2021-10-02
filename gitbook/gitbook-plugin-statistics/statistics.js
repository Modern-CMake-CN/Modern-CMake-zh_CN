require(["gitbook", 'jQuery'], function(gitbook, $) {

    let bdToken;
    let bdUrl;
    let cnzzId;
    let cnzzUrl;
    let googleUrl;
    let googleId;

    function insertStatisticsScript() {
        if (bdToken !== "") {
            const hm = document.createElement('script');
            hm.src = bdUrl+'?' + bdToken;
            const s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(hm, s);
        }

        if (cnzzId !== 0) {
            const hm2 = document.createElement('script');
            hm2.src = cnzzUrl+'?id=' + cnzzId + '&web_id='+cnzzId;
            const s2 = document.getElementsByTagName('script')[0];
            s2.parentNode.insertBefore(hm2, s2);

            // const res = '<div style=\'color: red\'>' +
            //     '<script type="text/javascript">' +
            //     'document.write(unescape("%3Cspan id=\'cnzz_stat_icon_'+cnzzId+'\'%3E%3C/span%3E%3Cscript src=\''+cnzzUrl+'%3Fid%3D'+cnzzId+'\' type=\'text/javascript\'%3E%3C/script%3E"));' +
            //     '</script>' +
            //     '</div>';
            // $('body').append(res);
        };

        if (googleId !== 0) {
            const res = "    <script async src='https://www.googletagmanager.com/gtag/js?id="+googleId+"'></script>\n" +
                "        <script>\n" +
                "        window.dataLayer = window.dataLayer || [];\n" +
                "        function gtag(){dataLayer.push(arguments);}\n" +
                "        gtag('js', new Date());\n" +
                "\n" +
                "        gtag('config', '"+googleId+"');\n" +
                "    </script>";
            $('body').append(res);
        }
    }

    gitbook.events.bind("start", function(e, config) {
        bdToken = config.statistics.bd_token || "";
        bdUrl = config.statistics.bd_url || "";
        cnzzId = config.statistics.cnzz_id || 0;
        cnzzUrl = config.statistics.cnzz_url || "";
        googleId = config.statistics.google_id || 0;
        googleUrl = config.statistics.google_url || "";
        insertStatisticsScript()
    });
    gitbook.events.bind('page.change', function() {
        insertStatisticsScript();
    });
});