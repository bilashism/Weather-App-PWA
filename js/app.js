! function preLoader() {
    style = document.createElement("style"), style.type = "text/css", style.innerText = ".noScroll { position: fixed; overflow: hidden; }", document.querySelector("head").appendChild(style), document.body.classList.add("noScroll");
    let preloader = document.querySelector(".preloader");
    window.addEventListener("load", () => { preloader.classList.add("loaded"), document.body.classList.remove("noScroll"), document.querySelector("head").removeChild(style), delete style })
}(), "serviceWorker" in navigator && navigator.serviceWorker.register("./sw.js", { scope: "/weather-app-pwa/" }).then(() => console.log("service worker registered")).catch(err => console.log("service worker not registered", err)), document.addEventListener("DOMContentLoaded", () => {
    let location = document.querySelector(".location"),
        temp = document.querySelector(".temp"),
        unit = document.querySelector(".unit"),
        summaryTxt = document.querySelector(".summary"),
        info = document.querySelector(".info"),
        searchForm = document.querySelector(".search-form"),
        today = document.querySelector(".today"),
        tomorrow = document.querySelector(".tomorrow"),
        errorTxt = "Please enter a valid place name!",
        location2 = document.querySelector(".location2"),
        temp2 = document.querySelector(".temp2"),
        summaryTxt2 = document.querySelector(".summary2"),
        preloaderSelectorArr = [location, temp, summaryTxt, today, tomorrow],
        selectorArrForTypeWriter = [".location", ".temp", ".summary", ".today", ".tomorrow"],
        loaderAnim = '<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>',
        placeName = document.querySelector(".search_input");
    const opencage_apikey = "8631f37008af4afbbb6077f545b1b0be",
        darksky_api_key = "2ae7d598568b7c56f3ae4e1be24d5def",
        opencage_api_url = "https://api.opencagedata.com/geocode/v1/json",
        darksky_proxy = "https://cors-anywhere.herokuapp.com/";

    function allFetcher(req_url) {
        fetch(`${darksky_proxy}${req_url}`).then(res => res.json()).then(data => {
            console.log(data);
            const darksky_api2 = `${darksky_proxy}https://api.darksky.net/forecast/${darksky_api_key}/${data.results[0].geometry.lat},${data.results[0].geometry.lng}?units=auto`;
            fetch(darksky_api2).then(res => res.json()).then(acctualData => {
                console.log(acctualData);
                const { summary: summary, temperature: temperature, icon: icon } = acctualData.currently;
                setIcons(icon, document.querySelector(".weather-icon"), "--icon-color"), location.textContent = data.results[0].formatted, summaryTxt.textContent = summary, temp.textContent = `${temperature}`, unit.textContent = "°c", selectorArrForTypeWriter.forEach(select => { new TypeWriter(select, Math.floor(10 * Math.random())) }),
                    function() {
                        let { summary: summary, icon: icon, temperatureMax: temperatureMax, temperatureMin: temperatureMin } = acctualData.daily.data[0];
                        today.textContent = `${summary}`, setIcons(icon, document.querySelector(".today-wrap .weather-icon"), "--indigo"), document.querySelector(".today-wrap .temp-min-max").textContent = `${parseInt(temperatureMin)}° | ${parseInt(temperatureMax)}°`
                    }(),
                    function() {
                        let { summary: summary, icon: icon, temperatureMax: temperatureMax, temperatureMin: temperatureMin } = acctualData.daily.data[1];
                        tomorrow.textContent = `${summary}`, setIcons(icon, document.querySelector(".tomorrow-wrap .weather-icon"), "--indigo"), document.querySelector(".tomorrow-wrap .temp-min-max").textContent = `${parseInt(temperatureMin)}° | ${parseInt(temperatureMax)}°`
                    }(),
                    function() {
                        let { summary: summary, icon: icon } = acctualData.daily;
                        document.querySelector(".week-wrap .week").textContent = `${summary}`, setIcons(icon, document.querySelector(".week-wrap .weather-icon"), "--indigo")
                    }()
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }

    function setIcons(icon, iconID, cssVar) {
        const skycons = new Skycons({ color: `${getComputedStyle(document.documentElement).getPropertyValue(cssVar)}` }),
            curentIcon = icon.replace(/-/g, "_").toUpperCase();
        return skycons.play(), skycons.set(iconID, Skycons[curentIcon])
    }
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        let placeNameVal = placeName.value,
            request_url = opencage_api_url + "?key=" + opencage_apikey + "&q=" + placeNameVal + "&pretty=1&no_annotations=1";
        null !== placeNameVal && isNaN(placeNameVal) && ("" === location.textContent ? location.innerHTML = loaderAnim : allFetcher(request_url)), preloaderSelectorArr.forEach(selected => { selected.textContent = "", selected.innerHTML = loaderAnim })
    }), navigator.geolocation && (navigator.geolocation.getCurrentPosition(position => {
        let latt = position.coords.latitude,
            lngg = position.coords.longitude,
            request_url = opencage_api_url + "?key=" + opencage_apikey + "&q=" + encodeURIComponent(latt + "," + lngg) + "&pretty=1&no_annotations=1";
        "" === location.textContent ? location.innerHTML = loaderAnim : allFetcher(request_url), allFetcher(request_url)
    }), preloaderSelectorArr.forEach(selected => { selected.textContent = "", selected.innerHTML = loaderAnim }));
    const searchIcon = document.querySelector(".search-icon"),
        search = document.querySelector(".search_input"),
        tip = document.querySelector(".tip");
    searchIcon.addEventListener("click", () => {
        search.classList.add("extended"), search.focus(), tip.classList.add("visible"), new TypeWriter(".tip", Math.floor(10 * Math.random()));
        let i = 0,
            message = "Enter your desired location",
            speed = 100;
        ! function typer() { i < message.length && (msg = search.getAttribute("placeholder") + message.charAt(i), search.setAttribute("placeholder", msg), i++, setTimeout(typer, 100)) }()
    }, { once: !0 });
    class TypeWriter {
        constructor(selector, speed) {
            let str = `${document.querySelector(selector).textContent} `,
                i = 0,
                isTag, text, speedd = this.speed || 50;
            ! function type() {
                if ((text = str.slice(0, ++i)) === str) return;
                document.querySelector(selector).textContent = text;
                let char = text.slice(-1);
                if ("<" === char && (isTag = !0), ">" === char && (isTag = !1), isTag) return type();
                setTimeout(type, speedd)
            }()
        }
    }

    function showTime() {
        let date = new Date,
            h = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds(),
            session = "am";
        0 == h && (h = 12), h > 12 && (h -= 12, session = "pm"), h = h < 10 ? "0" + h : h, m = m < 10 ? "0" + m : m, s = s < 10 ? "0" + s : s, document.querySelector(".clockNow").textContent = `${h}:${m}:${s}`, document.querySelector(".am-pm").textContent = `${session}`, setTimeout(showTime, 1e3)
    }
    showTime()
});
