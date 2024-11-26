(function (window, document) {
    "use strict";

    function grained(element, options) {
        const el = typeof element === 'string' ? document.getElementById(element.split('#')[1]) : element;
        if (!el) {
            console.error('Grained: cannot find the element with id ' + element);
            return;
        }

        el.style.position = el.style.position !== 'absolute' ? 'relative' : el.style.position;
        el.style.overflow = 'hidden';

        const opts = Object.assign({
            animate: true,
            patternWidth: 100,
            patternHeight: 100,
            grainOpacity: 0.1,
            grainDensity: 1,
            grainWidth: 1,
            grainHeight: 1,
            grainChaos: 0.5,
            grainSpeed: 20
        }, options);

        const generateNoise = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = opts.patternWidth;
            canvas.height = opts.patternHeight;
            for (let w = 0; w < opts.patternWidth; w += opts.grainDensity) {
                for (let h = 0; h < opts.patternHeight; h += opts.grainDensity) {
                    const rgb = Math.random() * 256 | 0;
                    ctx.fillStyle = `rgba(${rgb},${rgb},${rgb},${opts.grainOpacity})`;
                    ctx.fillRect(w, h, opts.grainWidth, opts.grainHeight);
                }
            }
            return canvas.toDataURL('image/png');
        };

        const addCSSRule = function (sheet, selector, rules) {
            const rule = `${selector}{${rules}}`;
            sheet.insertRule ? sheet.insertRule(rule) : sheet.addRule(selector, rules);
        };

        const noise = generateNoise();
        const keyFrames = ['0%:-10%,10%', '10%:-25%,0%', '20%:-30%,10%', '30%:-30%,30%', '40%:-20%,20%', '50%:-15%,10%', '60%:-20%,20%', '70%:-5%,20%', '80%:-25%,5%', '90%:-30%,25%', '100%:-10%,10%'];
        const animation = keyFrames.map(frame => `@keyframes grained{${frame.split(':')[0]}{transform:translate(${frame.split(':')[1]});}}`).join('');

        let style = document.createElement("style");
        style.type = "text/css";
        style.id = 'grained-animation';
        style.innerHTML = animation;
        document.body.appendChild(style);

        let rule = `background-image: url(${noise});position: absolute;content: "";height: 300%;width: 300%;left: -100%;top: -100%;`;
        if (opts.animate) {
            rule += `animation-name:grained;animation-iteration-count: infinite;animation-duration: ${opts.grainChaos}s;animation-timing-function: steps(${opts.grainSpeed}, end);`;
        }

        style = document.createElement("style");
        style.type = "text/css";
        style.id = 'grained-animation-' + el.id;
        document.body.appendChild(style);

        addCSSRule(style.sheet, `#${el.id}::before`, rule);
    }

    window.grained = grained;
})(window, document);