/*!
 * @aerify/react v0.0.1
 * (c) Blujedi LLC <blujedicorp@gmail.com>
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactDom = require('react-dom');
require('fuse.js');
var clsx = require('clsx');
var tinycolor = require('tinycolor2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var clsx__default = /*#__PURE__*/_interopDefaultLegacy(clsx);
var tinycolor__default = /*#__PURE__*/_interopDefaultLegacy(tinycolor);

/**
 * Persist ref between renders/update if changes.
 *
 * @param value the value or function to persist.
 */
function useLastRef(value) {
    var ref = React.useRef(value);
    React.useEffect(function () {
        ref.current = value;
    }, [value]);
    return ref;
}

/**
 * Provides setTimeout hook.
 *
 * @param cb callback to run after delay
 * @param timeout the timeout delay (in ms)
 */
function useTimeout(cb, timeout) {
    var cbRef = useLastRef(cb);
    React.useEffect(function () {
        if (timeout == null)
            return undefined;
        var timeoutId = window.setTimeout(function () {
            var _a;
            (_a = cbRef.current) === null || _a === void 0 ? void 0 : _a.call(cbRef);
        }, timeout);
        return function () {
            if (timeoutId)
                window.clearTimeout(timeoutId);
        };
    }, [cbRef, timeout]);
}

/**
 * Effect called only on update not on mount.
 *
 * @param cb the useEffect callback.
 * @param deps useEffect callback dependencies for triggering render.
 */
function useUpdate(cb) {
    var deps = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        deps[_i - 1] = arguments[_i];
    }
    var mounted = React.useRef(false);
    React.useEffect(function () {
        if (mounted.current)
            return cb();
        mounted.current = true;
        return undefined;
    }, deps);
    return mounted.current;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || from);
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var Portal = function (props) {
    props = __assign({ selector: '__ROOT_PORTAL__' }, props);
    var _a = props, selector = _a.selector, children = _a.children;
    var containerRef = React.useRef();
    var _b = __read(React.useState(false), 2), mounted = _b[0], setMounted = _b[1];
    var selectorPrefixed = '#' + (selector === null || selector === void 0 ? void 0 : selector.replace(/^#/, ''));
    React.useEffect(function () {
        containerRef.current = document.querySelector(selectorPrefixed);
        if (!containerRef.current) {
            var div = document.createElement('div');
            div.setAttribute('id', selector);
            document.body.appendChild(div);
            containerRef.current = div;
        }
        setMounted(true);
    }, [selector, selectorPrefixed]);
    return mounted
        ? reactDom.createPortal(children, containerRef.current)
        : null;
};

/**
 * Generates a simple unique Id.
 *
 * @param radix the base number of unique digits.
 */
function generateUID(radix) {
    if (radix === void 0) { radix = 16; }
    return '#' + ((Math.random() * 0xffffff) << 0).toString(radix);
}

function reducer(state, action) {
    switch (action.type) {
        case 'ADD': {
            state = __spreadArray(__spreadArray([], __read(state)), [action.payload]);
            return state;
        }
        case 'REMOVE': {
            state = state.filter(function (v) { return v.id !== action.payload; });
            return state;
        }
        case 'REMOVE_ALL': {
            if (!action.payload)
                state = [];
            else
                state = state.filter(function (v) { return v.uid !== action.payload; });
            return state;
        }
        default:
            return state;
    }
}

var Context = React.createContext(null);
var Consumer = Context.Consumer;
var useContext = function (uid) {
    return React.useContext(Context)(uid);
};
var Provider = function (_a) {
    var children = _a.children;
    var initialState = [];
    var _b = __read(React.useReducer(reducer, initialState), 2), state = _b[0], dispatch = _b[1];
    var context = function (uid) {
        if (uid === void 0) { uid = '*'; }
        return {
            get items() {
                return state;
            },
            add: function (options) {
                if (typeof options === 'undefined' || options == null)
                    return;
                if (typeof options === 'string' ||
                    React.isValidElement(options) ||
                    typeof options === 'function')
                    options = { content: options };
                // Closeable and uid may be
                // overriden by controller.
                var item = __assign(__assign({ closeable: true, uid: uid }, options), { id: generateUID(), created: Date.now() });
                dispatch({ type: 'ADD', payload: item });
            },
            remove: function (itemOrId) {
                var id = itemOrId;
                if (typeof itemOrId !== 'string') {
                    itemOrId = state.find(function (v) { return v === itemOrId; });
                    id = itemOrId === null || itemOrId === void 0 ? void 0 : itemOrId.id;
                }
                dispatch({ type: 'REMOVE', payload: id });
            },
            removeAll: function (uid) { return dispatch({ type: 'REMOVE_ALL', payload: uid }); },
        };
    };
    var element = (React__default['default'].createElement(Context.Provider, { value: context }, children));
    return element;
};
Provider.displayName = 'NotifyProvider';

var DEFAULT_POSITION = 'bottom-right';
var DEFAULT_TIMEOUT = 4000;
var CONTAINER_STYLES = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    position: 'fixed',
    top: undefined,
    left: undefined,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '10em',
    transition: 'max-height 1s ease',
};
var ITEM_STYLE = {
    position: 'relative',
    width: '250px',
    flex: '0 0 80px',
    margin: '10px',
    borderRadius: '2px',
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    boxShadow: '2px 2px 8px rgba(0, 0, 0, 0.2)',
    border: '1px solid #111',
    listStyle: 'none',
    minHeight: '80px',
    padding: '10px',
    color: '#fff',
};
var CLOSE_STYLE = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    cursor: 'pointer',
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var NotifyComponentCreate = function (props) {
    var _a = props, onClose = _a.onClose, timeout = _a.timeout, id = _a.id;
    var NotifyComponent = props.NotifyComponent, componentProps = __rest(props, ["NotifyComponent"]);
    var _b = __read(React.useState(null), 2), duration = _b[0], setDuration = _b[1];
    var paused = React.useRef(false);
    function onEnter() {
        paused.current = true;
        setDuration(null);
    }
    function onLeave() {
        paused.current = false;
        setDuration(timeout);
    }
    useUpdate(function () {
        if (!paused.current)
            setDuration(timeout);
    }, [timeout]);
    useTimeout(onClose, duration);
    var element = (React__default['default'].createElement(NotifyComponent, __assign({ key: id }, componentProps, { onEnter: onEnter, onLeave: onLeave })));
    return element;
};
var NotifyComponentDefault = function (props) {
    props.itemStyle = __assign(__assign({}, ITEM_STYLE), props.itemStyle);
    props.closeStyle = __assign(__assign({}, CLOSE_STYLE), props.closeStyle);
    var id = props.id, onEnter = props.onEnter, onLeave = props.onLeave, onClose = props.onClose, content = props.content, itemStyle = props.itemStyle, closeStyle = props.closeStyle;
    return (React__default['default'].createElement("li", { key: id, style: itemStyle, onMouseEnter: onEnter, onMouseLeave: onLeave },
        React__default['default'].createElement("span", { style: closeStyle, onClick: onClose }, "\u2715"),
        content));
};
var NotifyController = function (props) {
    props = __assign({ uid: '*', timeout: DEFAULT_TIMEOUT, position: DEFAULT_POSITION, max: 5, filter: function () { return true; } }, props);
    // Allow custom component to be passed to render function.
    var _a = props, children = _a.children, NotifyComponent = _a.NotifyComponent, rest = __rest(_a, ["children", "NotifyComponent"]);
    var controller = useNotify(rest);
    // Allow override of container.
    var containerStyle = getContainerStyle(rest.position);
    // If children provided use it otherwise render from default.
    return (React__default['default'].createElement(Portal, null,
        React__default['default'].createElement("ul", { id: "notify-controller-" + controller.uid, style: containerStyle }, children || controller.render(NotifyComponent))));
};
var getContainerStyle = function (position) {
    var styles = __assign({}, CONTAINER_STYLES);
    if (position === 'bottom-right')
        return styles;
    // reset the styels.
    styles.bottom = undefined;
    styles.right = undefined;
    if (position === 'top') {
        styles.top = 0;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        return styles;
    }
    if (position === 'bottom') {
        styles.bottom = 0;
        styles.left = '50%';
        styles.transform = 'translateX(-50%)';
        return styles;
    }
    if (position === 'top-right') {
        styles.top = 0;
        styles.right = 0;
        return styles;
    }
    if (position === 'bottom-left') {
        styles.bottom = 0;
        styles.left = 0;
        return styles;
    }
    styles.top = 0;
    styles.left = 0;
    return styles;
};
function useNotify(props) {
    if (typeof props === 'string') {
        props = {
            uid: props,
        };
    }
    props = __assign({ uid: '*', timeout: DEFAULT_TIMEOUT, position: DEFAULT_POSITION, max: 5, filter: function () { return true; } }, props);
    var _a = props, uid = _a.uid, timeout = _a.timeout, max = _a.max, position = _a.position, filter = _a.filter;
    var itemStyle = props.itemStyle || __assign({}, ITEM_STYLE);
    var closeStyle = props.closeStyle || __assign({}, CLOSE_STYLE);
    var notify = useContext();
    var _b = __read(React.useState([]), 2), removeQueue = _b[0], setRemoveQueue = _b[1];
    function add(itemOrContent) {
        if (typeof itemOrContent === 'string' ||
            typeof itemOrContent === 'function' ||
            React.isValidElement(itemOrContent))
            itemOrContent = {
                content: itemOrContent,
            };
        itemOrContent.uid = uid;
        notify.add(itemOrContent);
    }
    function remove(itemOrId) {
        notify.remove(itemOrId);
    }
    var removeAll = function () {
        notify.removeAll(uid);
    };
    /**
     * Filters and limits collection.
     *
     * @param items list of items to be filtered and limited.
     */
    var load = React.useCallback(function () {
        // Get filtered items.
        var items = (notify.items || []).filter(function (item) { return item.uid === uid && filter(item); });
        // If on bottom we want to display with newest
        // on bottom rather than top.
        if (position === null || position === void 0 ? void 0 : position.includes('top'))
            items = items.reverse();
        // limit the total number of notifications.
        return items.slice(0, max);
    }, [filter, max, notify.items, position, uid]);
    /**
     * Builds notification item list and renders/maps out item components.
     */
    var render = function (NotifyComponent) {
        return load().map(function (item) {
            item = __assign({ timeout: timeout }, item);
            var onClose = function () {
                if (!item.closeable)
                    return;
                setRemoveQueue(__spreadArray(__spreadArray([], __read(removeQueue)), [item.id]));
            };
            var componentProps = __assign(__assign({}, item), { onClose: onClose, NotifyComponent: NotifyComponent || NotifyComponentDefault, itemStyle: itemStyle, closeStyle: closeStyle });
            if (typeof componentProps.content === 'function')
                componentProps.content = componentProps.content(item);
            return (React__default['default'].createElement(NotifyComponentCreate, __assign({ key: 'notify-create-' + item.id }, componentProps)));
        });
    };
    React.useEffect(function () {
        removeQueue.forEach(function (id) {
            notify.remove(id);
        });
    }, [removeQueue]);
    var controller = {
        // return normalized props for
        // extending to NotifyController
        options: props,
        add: add,
        remove: remove,
        removeAll: removeAll,
        uid: uid,
        load: load,
        render: render,
    };
    return controller;
}

function useStateRef(initialValue) {
    var _a = __read(React.useState(initialValue), 2), state = _a[0], setStateBase = _a[1];
    var ref = React.useRef(initialValue);
    var setState = function (value) {
        ref.current = value;
        setStateBase(value);
    };
    return [state, setState, ref];
}
var usePortal = function (props) {
    props = __assign({ closeOnClick: true, closeOnEsc: true, allowScroll: false }, props);
    var _a = props, closeOnClick = _a.closeOnClick, closeOnEsc = _a.closeOnEsc, onClose = _a.onClose, allowScroll = _a.allowScroll;
    var _b = __read(useStateRef(false), 3), visible = _b[0], setVisible = _b[1], visibleRef = _b[2];
    var html = React.useRef();
    var overflow = React.useRef();
    var container = React.useRef();
    var open = React.useCallback(function (e) {
        if (visibleRef.current)
            return;
        if (e && e.nativeEvent)
            e.nativeEvent.stopImmediatePropagation();
        if (!allowScroll && html.current) {
            // Just in case for some reason it changes.
            // ensure we can set back to previous value.
            overflow.current = html.current.style.overflow;
            html.current.style.overflow = 'hidden';
        }
        setVisible(true);
    }, [allowScroll, setVisible, visibleRef]);
    var close = React.useCallback(function (e) {
        if (!visibleRef.current)
            return;
        if (!allowScroll && html.current && overflow.current)
            html.current.style.overflow = overflow.current;
        setVisible(false);
        container.current = undefined;
        if (onClose)
            onClose(e);
    }, [allowScroll, onClose, setVisible, visibleRef]);
    var containerRef = function (el) {
        container.current = el;
    };
    React.useEffect(function () {
        var htmlElement = document.querySelector('html');
        if (htmlElement) {
            html.current = htmlElement;
            overflow.current = html.current.style.overflow;
        }
        return function () {
            html.current = undefined;
        };
    }, []);
    React.useEffect(function () {
        function handleKeyDown(e) {
            if (e.keyCode === 27 && visibleRef.current)
                close(e);
        }
        function handleClick(e) {
            if (visibleRef.current && !container.current)
                console.warn("Cannot use click handler with containerRef of undefined. Try <div ref={containerRef}></div> on primary container element.");
            if (!visibleRef.current ||
                !container.current ||
                container.current.contains(e.target) ||
                (e.button && e.button !== 0))
                return;
            close(e);
        }
        if (closeOnEsc)
            document.addEventListener('keydown', handleKeyDown);
        if (closeOnClick)
            document.addEventListener('click', handleClick);
        return function () {
            if (closeOnEsc)
                document.removeEventListener('keydown', handleKeyDown);
            if (closeOnClick)
                document.removeEventListener('click', handleClick);
        };
    }, [closeOnClick, closeOnEsc, close, visibleRef]);
    return {
        Portal: Portal,
        containerRef: containerRef,
        visible: visible,
        open: open,
        close: close,
    };
};

var useTabs = function () {
    var _a = __read(React.useState({
        active: '',
        ids: [],
        tabs: [],
    }), 2), state = _a[0], setState = _a[1];
    var setActive = function (active) {
        setState(__assign(__assign({}, state), { active: active }));
    };
    var addTab = function (id, tab) {
        if (!state.ids.includes(id))
            setState(__assign(__assign({}, state), { ids: __spreadArray(__spreadArray([], __read(state.ids)), [id]), tabs: __spreadArray(__spreadArray([], __read(state.tabs)), [tab]) }));
    };
    return {
        get state() {
            return state;
        },
        get active() {
            return state.active;
        },
        get tabs() {
            return state.tabs;
        },
        get ids() {
            return state.ids;
        },
        addTab: addTab,
        setState: setState,
        setActive: setActive,
    };
};

var Tab = function (props) {
    var _a = props, element = _a.element, id = _a.id, tabs = _a.tabs, activeClass = _a.activeClass;
    var tabId = "tab-" + id;
    var tabHash = '#' + tabId;
    // Prevent default to prevent hash jump.
    var component = (React__default['default'].createElement("a", { href: tabHash, onClick: function (e) {
            e.preventDefault();
            tabs.setActive(id);
        } }, props.label));
    if (typeof props.label !== 'string') {
        if (typeof props.label === 'function') {
            var Comp = props.label;
            component = React__default['default'].createElement(Comp, __assign({}, props));
        }
        else {
            component = props.label;
        }
    }
    var className = activeClass && id === tabs.active ? activeClass : '';
    if (element === 'li')
        return (React__default['default'].createElement("li", { id: tabId, className: className }, component));
    return (React__default['default'].createElement("div", { id: tabId, className: className }, component));
};
var Panel = function (props) {
    var _a = props, children = _a.children, tabs = _a.tabs, activeClass = _a.activeClass, id = _a.id, containerProps = _a.containerProps, active = _a.active, tab = _a.tab;
    React.useEffect(function () {
        if (tabs) {
            if (!tabs.ids.includes(id)) {
                tabs.addTab(id, tab);
            }
            if (active && !tabs.active)
                tabs.setActive(id);
        }
    }, [id, tabs]);
    if ((tabs === null || tabs === void 0 ? void 0 : tabs.active) && id !== tabs.active)
        return null;
    var className = activeClass && id === (tabs === null || tabs === void 0 ? void 0 : tabs.active) ? activeClass : '';
    if (containerProps.className && className)
        className = containerProps.className + ' ' + className;
    return (React__default['default'].createElement("div", __assign({}, containerProps, { className: className }), children));
};
var Pane = function (props) {
    var children = props.children;
    return React__default['default'].createElement(React__default['default'].Fragment, null, children);
};
var Tabs = function (props) {
    props = __assign({ element: 'ul', activeClass: 'is-active' }, props);
    var children = props.children, element = props.element, activeClass = props.activeClass, tabsInit = props.tabs, className = props.className, onChange = props.onChange;
    var initTabs = [];
    // Allow passing in tabs instance
    var tabs = useTabs();
    if (tabsInit)
        tabs = tabsInit;
    var containerProps = __assign({}, props.containerProps);
    containerProps.className = containerProps.className || className;
    var panels = React.Children.toArray(children).map(function (c, i) {
        var _a, _b, _c, _d, _e, _f;
        var child = c;
        var label = (_a = child.props) === null || _a === void 0 ? void 0 : _a.label;
        if (!label)
            throw new Error("Invalid label configuration at index " + i + ".");
        var id = ((_b = child.props) === null || _b === void 0 ? void 0 : _b.id) || i + '';
        var active = (_c = child.props) === null || _c === void 0 ? void 0 : _c.active;
        var panelClassName = (_d = child.props) === null || _d === void 0 ? void 0 : _d.className;
        var panelContainerProps = ((_e = child.props) === null || _e === void 0 ? void 0 : _e.containerProps) || {};
        var tab = (React__default['default'].createElement(Tab, { key: i + 1, id: id, element: element === 'ul' ? 'li' : 'div', label: label, tabs: tabs, activeClass: activeClass }));
        initTabs.push(tab);
        panelContainerProps.className =
            panelContainerProps.className || panelClassName;
        return (React__default['default'].createElement(Panel, { key: i + 1, id: id, tabs: tabs, tab: tab, active: active, activeClass: activeClass, containerProps: panelContainerProps }, (_f = child.props) === null || _f === void 0 ? void 0 : _f.children));
    });
    // Limit on change events so it only fires
    // once we have all our tabs loaded.
    // after that fire on every tab change.
    var hasInit = tabs && tabs.state && initTabs.length === tabs.state.ids.length;
    React.useEffect(function () {
        if (onChange && hasInit)
            onChange(tabs.state);
    }, [tabs.active, onChange, tabs.state, hasInit]);
    if (element === 'ul') {
        return (React__default['default'].createElement("div", __assign({}, containerProps),
            React__default['default'].createElement("ul", null, initTabs),
            panels));
    }
    return (React__default['default'].createElement("div", __assign({}, containerProps),
        React__default['default'].createElement("div", null, initTabs),
        panels));
};

function createPaginator(itemsOrOptions, page, size, pages) {
    if (itemsOrOptions === void 0) { itemsOrOptions = 0; }
    if (page === void 0) { page = 1; }
    if (size === void 0) { size = 10; }
    if (pages === void 0) { pages = 3; }
    var items = itemsOrOptions;
    if (!Array.isArray(itemsOrOptions) && typeof itemsOrOptions === 'object') {
        var initItems = itemsOrOptions.items, initPage = itemsOrOptions.page, initDisplayed = itemsOrOptions.size, initButtons = itemsOrOptions.pages;
        items = initItems;
        page = initPage;
        size = initDisplayed;
        pages = initButtons;
    }
    // Ensure ints as user may pass a string.
    if (Array.isArray(items))
        items = items.length;
    items = parseInt(items);
    page = parseInt(page);
    size = parseInt(size);
    pages = parseInt(pages);
    items = items || 0;
    // Total number of pages based on the
    // size or number of items to display.
    var totalPages = Math.ceil(items / size);
    // ensure current page isn't out of range
    if (page < 1)
        page = 1;
    else if (page > totalPages)
        page = totalPages;
    var startPage;
    var endPage;
    // Total is less than shown so show all pages.
    if (totalPages <= pages) {
        startPage = 1;
        endPage = totalPages;
    }
    else {
        // Caclulate before/after current page.
        var pagesBeforeCurrent = Math.floor(pages / 2);
        var pagesAfterCurrent = Math.ceil(pages / 2) - 1;
        // Calculate start
        if (page <= pagesBeforeCurrent) {
            startPage = 1;
            endPage = pages;
        }
        // Calcutate end
        else if (page + pagesAfterCurrent >= totalPages) {
            startPage = totalPages - pages + 1;
            endPage = totalPages;
        }
        // Calcluate middle of range.
        else {
            startPage = page - pagesBeforeCurrent;
            endPage = page + pagesAfterCurrent;
        }
    }
    // Get start page for range.
    var rangeStart = (page - 1) * size;
    // Get end page for range.
    var rangeEnd = Math.min(rangeStart + size - 1, items - 1);
    // Array of pages.
    var activePages = Array.from(Array((endPage + 1) - startPage).keys()).map(function (i) { return startPage + i; });
    var getRange = function (collection) { return collection.slice(rangeStart, rangeEnd + 1); };
    var api = {
        items: items,
        page: page,
        size: size,
        pages: pages,
        totalPages: totalPages,
        startPage: startPage,
        endPage: endPage,
        rangeStart: rangeStart,
        rangeEnd: rangeEnd,
        activePages: activePages,
        getRange: getRange // accepts array of collection items returns range. 
    };
    return api;
}

function PagerBase(props) {
    props.controller; var rest = __rest(props, ["controller"]);
    return (React__default['default'].createElement("div", __assign({}, rest), "My Pager"));
}

var DefaultButton = function (props) {
    return React__default['default'].createElement("button", __assign({}, props));
};
var DEFAULTS = {
    items: 0,
    page: 1,
    size: 10,
    pages: 3,
    ButtonTemplate: DefaultButton,
    disabled: false
};
function useCreateController(props) {
    props = __assign(__assign({}, DEFAULTS), props);
    var ButtonTemplate = props.ButtonTemplate, activeClass = props.activeClass, activeStyle = props.activeStyle, rest = __rest(props, ["ButtonTemplate", "activeClass", "activeStyle"]);
    var _a = __read(React.useState(createPaginator(rest)), 2), paginator = _a[0], setPaginator = _a[1];
    var api = __assign(__assign({}, paginator), { get config() {
            var page = paginator.page, size = paginator.size, pages = paginator.pages, items = paginator.items;
            return {
                page: page,
                size: size,
                pages: pages,
                items: items
            };
        }, update: update, hasPrev: hasPrev, hasNext: hasNext, hasPages: hasPages, hasFirst: hasFirst, hasLast: hasLast, isPrevDisabled: isPrevDisabled, isNextDisabled: isNextDisabled, isPageActive: isPageActive, createButton: createButton, createPageButtons: createPageButtons, canPage: canPage, to: to, previous: previous, next: next, first: first, last: last });
    function update(options) {
        var page = paginator.page, pages = paginator.pages, items = paginator.items, size = paginator.size;
        var newPaginator = createPaginator(__assign({ page: page, pages: pages, items: items, size: size }, options));
        setPaginator(newPaginator);
    }
    /**
     * Checks if previous button should be disabled.
     */
    function isPrevDisabled() {
        return !hasPrev() || paginator.page <= 1;
    }
    /**
     * Checks if next button should be disabled.
     */
    function isNextDisabled() {
        return !hasNext() || paginator.page >= paginator.activePages.slice(-1)[0];
    }
    function isPageActive(page) {
        return page === paginator.page;
    }
    /**
     * Checks if items exist to have previous button.
     */
    function hasPrev() {
        return !!paginator.items;
    }
    /**
     *  Checks if items exist to have next button.
     */
    function hasNext() {
        return !!paginator.items;
    }
    /**
     *  Checks if items exist to have pages buttons.
     */
    function hasPages() {
        return paginator.activePages && paginator.activePages.length;
    }
    /**
     * Checks if active pages contains first page.
     */
    function hasFirst() {
        return paginator.activePages.includes(1);
    }
    /**
     * Checks if active pages contains last page.
     */
    function hasLast() {
        return paginator.activePages.includes(paginator.totalPages);
    }
    /**
     * Checks if a page can be navigated to.
     *
     * @param to the page number to check if can navigate to.
     */
    function canPage(to) {
        return to >= 1 && to <= paginator.activePages.slice(-1)[0];
    }
    /**
     * Changes page to specified page number if "canPage" is valid.
     *
     * @param page the page to change to.
     */
    function to(page) {
        if (!canPage(page))
            return;
        update({ page: page });
    }
    function previous() {
        var prev = paginator.page - 1;
        if (!canPage(prev))
            return;
        update({ page: prev });
    }
    function next() {
        var nxt = paginator.page + 1;
        if (!canPage(nxt))
            return;
        update({ page: nxt });
    }
    function first() {
        if (!canPage(1))
            return;
        update({ page: 1 });
    }
    function last() {
        var lst = paginator.totalPages;
        if (!canPage(lst))
            return;
        update({ page: lst });
    }
    /**
     * Creates a Button component.
     *
     * @param button
     */
    function createButton(type, defaults, ButtonComponent) {
        if (typeof defaults === 'function') {
            ButtonComponent = defaults;
            defaults = undefined;
        }
        var Button = (ButtonComponent || ButtonTemplate);
        var PagerButton = function (props) {
            props = __assign(__assign({}, (defaults || {})), props);
            props.children = type + '';
            // Add styling for active page buttons.
            if (typeof type === 'number' && isPageActive(type) && (activeClass || activeStyle)) {
                if (activeClass)
                    props.className = clsx__default['default'](props.className, activeClass);
                if (activeStyle)
                    props.style = __assign(__assign({}, (props.style || {})), activeStyle);
            }
            return React__default['default'].createElement(Button, __assign({}, props));
        };
        return PagerButton;
    }
    /**
     * Helper to build pager buttons set between previous and next.
     */
    function createPageButtons(pages, ButtonComponent) {
        if (pages === void 0) { pages = paginator.activePages; }
        // Build primary pages.
        var buttons = pages.map(function (pg) {
            var defaults = {
                key: "btn-" + pg,
                'aria-label': "Page " + pg,
                'aria-current': isPageActive(pg) ? 'page' : 'false',
                onClick: function () { return to(pg); }
            };
            return createButton(pg, defaults, ButtonComponent);
        });
        // Check if should build first and last pages.
        return buttons;
    }
    return api;
}
function usePager(props) {
    var _a = props, PagerInit = _a.Pager, disabled = _a.disabled, rest = __rest(_a, ["Pager", "disabled"]);
    var controller = useCreateController(rest);
    var Base = PagerInit || PagerBase;
    var Pager = function (pprops) {
        pprops = __assign({}, pprops);
        pprops.controller = pprops.controller || controller;
        return React__default['default'].createElement(Base, __assign({}, pprops));
    };
    if (disabled)
        return null;
    return __assign(__assign({}, controller), { Pager: Pager });
}

var THEME_NAME = '__aerify_theme__';
var THEME_GLOBALS_NAME = '__aerify_global__';
/**
 * Creates isomorphic hook for useLayoutEffect
 *
 * @returns isomorphic use effect.
 */
var useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
/**
 * A non-operation function.
 *
 * @param _args rest param of args
 * @returns void
 */
var noop = function () {
    var _args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _args[_i] = arguments[_i];
    }
};
/**
 * Lightweight unique identifier generator.
 *
 * @param radix the base mathmatical numeral system.
 * @returns a unique identifier.
 */
var genUID = function (radix) {
    if (radix === void 0) { radix = 16; }
    return '$' + (Math.random() * 0xFFFFFF << 0).toString(radix);
};
/**
 * Normalizes css string from template literal.
 * NOTE installed the following extension for proper template highlighting.
 *
 * @see https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components
 *
 * @param strings the template strings to process.
 * @param args arg to apply.
 * @returns a normalized css string.
 */
var css = function (strings) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    return strings.reduce(function (acc, string, index) { return acc + string + (index < args.length ? args[index] : ''); }, '');
};
/**
 * Accepts a css variable and converts to camelcase.
 *
 * @example
 * backgroundColor = fromVar('--background-color');
 *
 * @param str the string to be converted.
 * @returns a css var string converted to camelcase.
 */
var fromCSSVar = function (str) {
    if (str === void 0) { str = ''; }
    return ((str.match(/[a-z0-9]{1,}-[a-z0-9]{1,}/gi) || [])[0] || '')
        .split('-')
        .map(function (v, i) {
        if (i === 0)
            return v;
        return v.charAt(0).toUpperCase() + v.slice(1);
    })
        .join('');
};
/**
* Converts a camelcase string to a css variable.
*
* @example
* --background-color = fromVar('backgroundColor');
*
* @param str the string to convert to css variable.
* @returns a string css variable.
*/
var toCSSVar = function (str) {
    if (str === void 0) { str = ''; }
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .split('-')
        .map(function (v) { return v.toLowerCase(); }).join('-');
};
/**
 * Flattens a theme object into css key variables and its value.
 *
 * @param obj an object containing theme vars.
 * @param prefix a prefix to be added to every variable.
 * @param parents optional array when recursing.
 * @returns a flattened object of css variable key/values.
 */
var flattenTheme = function (obj, prefix, parents) {
    if (prefix === void 0) { prefix = ''; }
    if (parents === void 0) { parents = []; }
    var str = '';
    for (var k in obj) {
        var val = obj[k];
        if (Array.isArray(val) || val === null || !['string', 'number', 'object'].includes(typeof val)) {
            console.warn("key " + k + " has unsupported type, string, number or plain object supported.");
            continue;
        }
        else if (typeof val === 'object') {
            var nested = flattenTheme(val, prefix, __spreadArray(__spreadArray([], __read(parents)), [k]));
            str += nested;
        }
        else {
            var key = parents.length ? parents.join('-') + '-' + toCSSVar(k) : toCSSVar(k);
            if (prefix)
                key = prefix + key;
            str += ('  ' + key + ':' + val + ';\n');
        }
    }
    return str;
};
/**
 * Generates SASS variables for the specified theme.
 *
 * @param obj the theme object to parse as SASS variables or variables in map.
 * @param mapName an optional name for sass map name commonly $vars.
 * @param includeDefault include !default after variable or after map when using mapName.
 * @param parents internally uses when recursing the variables from the theme.
 * @returns a string representation of the theme.
 */
function genSassVars(obj, mapName, includeDefault, parents) {
    if (mapName === void 0) { mapName = '$vars'; }
    if (includeDefault === void 0) { includeDefault = true; }
    if (parents === void 0) { parents = []; }
    var str = '';
    for (var k in obj) {
        var val = obj[k];
        if (Array.isArray(val) || val === null || !['string', 'number', 'object'].includes(typeof val)) {
            console.warn("key " + k + " has unsupported type, string, number or plain object supported.");
            continue;
        }
        else if (typeof val === 'object') {
            var nested = genSassVars(val, mapName, includeDefault, __spreadArray(__spreadArray([], __read(parents)), [k]));
            str += nested;
        }
        else {
            var key = parents.length ? parents.join('-') + '-' + toCSSVar(k) : toCSSVar(k);
            var suffix = includeDefault && !mapName ? ' !default;\n' : !includeDefault && !mapName ? ';\n' : ',\n';
            var line = !mapName ? "$" + key + ": " + val + suffix : "  " + key + ": " + val + suffix;
            str += line;
        }
    }
    if (mapName && !parents.length)
        return (includeDefault ? mapName + ": (\n" + str + ") !default;" : mapName + ": (\n" + str + ");");
    return str;
}
/**
 * Initializes a simple API for interacting with localStorage.
 *
 * @example
 * const storage = initLocalStorage('blue');
 * sorage.set('red');
 * const storedTheme = storage.get();
 *
 * @param defaultTheme a default theme to use when getter returns null.
 * @returns a simple api for interacting with localStorage.
 */
var initLocalStorage = function () {
    var key = '__theme__';
    var api = {
        /**
         * Sets the default theme used ensures theme in localStorage.
         *
         * @param theme the theme to return as default.
         * @returns the default theme.
         */
        init: function (defaultTheme) {
            var currentTheme = api.get();
            if (!currentTheme)
                api.set(defaultTheme);
            return currentTheme || defaultTheme;
        },
        /**
         * Check if localStorage is is available.
         *
         * @returns boolean indicating if localStorage is present.
         */
        hasStorage: function () {
            return typeof localStorage !== 'undefined';
        },
        /**
         * Gets the currently stored theme in localStorage.
         *
         * @returns the theme stored in localStorage.
         */
        get: function () {
            if (!api.hasStorage())
                return;
            return localStorage.getItem(key);
        },
        /**
         * Sets the active theme in localStorage.
         *
         * @param theme the currently set theme.
         * @returns void
         */
        set: function (theme) {
            if (!api.hasStorage())
                return;
            localStorage.setItem(key, theme);
        }
    };
    return api;
};
/**
 * Converts pixel value to rem.
 * NOTE: for this to work html font-size
 * must be set to 62.5%
 *
 * @example
 * 1.6rem = toRem('16px');
 *
 * @param val the value to convert to rem.
 * @returns a string represented in rem.
 */
function toRem(val) {
    var parsed = parseInt(val + '', 10);
    var result = parsed / 10;
    return result + 'rem';
}
/**
 * Converts rem value to pixels.
 * NOTE: for this to work html font-size
 * must be set to 62.5%
 *
 * @example
 * 16px = toPixels('1.6rem');
 *
 * @param val the value to convert to pixels.
 * @returns a string represented in pixels.
 */
function toPixels(val) {
    var parsed = parseFloat(val + '');
    var result = parsed * 10;
    return result + 'px';
}
/**
 * Rounds a number with precision in decimals.
 *
 * @param val the value to be rounded.
 * @param precision the precision in decimal places to round
 * @returns a rounded number.
 */
function round(val, precision) {
    if (precision === void 0) { precision = 2; }
    val = parseFloat(val + '');
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(val * multiplier) / multiplier;
}
/**
 * Gets the scale between two values.
 *
 * @param newVal the large or new value in the scale.
 * @param oldVal the original or smaller value in the scale.
 * @returns a scale between two values.
 */
var getScale = function (newVal, oldVal) {
    return parseFloat(newVal + '') / parseFloat(oldVal + '');
};
/**
 * Scales a value up by a given factor.
 *
 * @param val the value to be scaled up.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
var scaleUp = function (val, factor, roundPrecision) {
    if (roundPrecision === void 0) { roundPrecision = 0; }
    val = parseFloat(val + '');
    var result = val * factor;
    if (roundPrecision)
        return round(result, roundPrecision);
    return result;
};
/**
 * Scales a value down by a given factor.
 *
 * @param val the value to be scaled down.
 * @param factor the factor by which to scale.
 * @param roundPrecision the rounding precision.
 * @returns a scaled value by provided factor.
 */
var scaleDown = function (val, factor, roundPrecision) {
    if (roundPrecision === void 0) { roundPrecision = 0; }
    val = parseFloat(val + '');
    var result = val / factor;
    if (roundPrecision)
        return round(result, roundPrecision);
    return result;
};
/**
 * Scales up from a given value by supplied factor.
 *
 * @example
 * [ 3.92, 5.49, 7.69 ] = createScaleUp(2.8, 1.4, 3)
 *
 * @param val the value to start from.
 * @param factor the factor to use to create the scale.
 * @param count the number of elements to calculate
 * @param roundPrecision the rounding precision (default 2)
 * @returns an array of scaled numbers.
 */
var createScaleUp = function (val, factor, count, roundPrecision) {
    if (roundPrecision === void 0) { roundPrecision = 2; }
    var arr = new Array(count).fill(0);
    return arr.reduce(function (a) {
        var nextVal = round(scaleUp(a.previous, factor), roundPrecision);
        a.previous = nextVal;
        a.result.push(nextVal);
        return a;
    }, { result: [], previous: val }).result;
};
/**
 * Scales up from a given value by supplied factor.
 *
 * @example
 * [ 2, 1.43, 1.02 ] = createScaleDown(2.8, 1.4, 3)
 *
 * @param val the value to start from.
 * @param factor the factor to use to create the scale.
 * @param count the number of elements to calculate
 * @param roundPrecision the rounding precision (default 2)
 * @returns an array of scaled numbers.
 */
var createScaleDown = function (val, factor, count, roundPrecision) {
    if (roundPrecision === void 0) { roundPrecision = 2; }
    var arr = new Array(count).fill(0);
    return arr.reduce(function (a) {
        var nextVal = round(scaleDown(a.previous, factor), roundPrecision);
        a.previous = nextVal;
        a.result.push(nextVal);
        return a;
    }, { result: [], previous: val }).result;
};
/**
 * Appends node after reference node as sibling.
 *
 * @param node the node to be appended after reference.
 * @param refNode the reference node for appending sibling.
 */
var appendAfter = function (node, refNode) {
    refNode.parentNode.insertBefore(node, refNode.nextSibling);
};

var THEME_TOGGLE_NAME = 'aerify-theme-toggle';
var THEME_SELECT_NAME = 'aerify-theme-select';
var createToggleStyles = function (_a) {
    var offColor = _a.offColor, onColor = _a.onColor, dotColor = _a.dotColor, color = _a.color;
    return css(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  \n  ", " {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    width: 72px;\n    height: 28px;\n    display: inline-block;\n    position: relative;\n    border-radius: 50px;\n    overflow: hidden;\n    outline: none;\n    cursor: pointer;\n    background-color: ", ";\n    transition: background-color ease 0.3s;\n  }\n\n  \n  ", ":before {\n    content: \"dark light\";\n    display: block;\n    position: absolute;\n    z-index: 2;\n    width: 28px;\n    height: 28px;\n    left: 0px;\n    top: 0px;\n    border-radius: 50%;\n    font: 10px/28px Helvetica;\n    text-transform: uppercase;\n    font-weight: bold;\n    text-indent: -32px;\n    word-spacing: 32px;\n    color: ", ";\n    background: ", ";\n    text-shadow: -1px -1px rgba(0,0,0,0.15);\n    white-space: nowrap;\n    box-shadow: 0 1px 2px rgba(0,0,0,0.2);\n    transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;\n    }\n  \n    ", ":checked {\n      background-color: ", ";\n    }\n  \n    ", ":checked:before {\n      left: 42px;\n    }\n  \n  "], ["\n  \n  ", " {\n    -webkit-appearance: none;\n    -moz-appearance: none;\n    appearance: none;\n    width: 72px;\n    height: 28px;\n    display: inline-block;\n    position: relative;\n    border-radius: 50px;\n    overflow: hidden;\n    outline: none;\n    cursor: pointer;\n    background-color: ", ";\n    transition: background-color ease 0.3s;\n  }\n\n  \n  ", ":before {\n    content: \"dark light\";\n    display: block;\n    position: absolute;\n    z-index: 2;\n    width: 28px;\n    height: 28px;\n    left: 0px;\n    top: 0px;\n    border-radius: 50%;\n    font: 10px/28px Helvetica;\n    text-transform: uppercase;\n    font-weight: bold;\n    text-indent: -32px;\n    word-spacing: 32px;\n    color: ", ";\n    background: ", ";\n    text-shadow: -1px -1px rgba(0,0,0,0.15);\n    white-space: nowrap;\n    box-shadow: 0 1px 2px rgba(0,0,0,0.2);\n    transition: all cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;\n    }\n  \n    ", ":checked {\n      background-color: ", ";\n    }\n  \n    ", ":checked:before {\n      left: 42px;\n    }\n  \n  "])), '.' + THEME_TOGGLE_NAME, offColor, '.' + THEME_TOGGLE_NAME, color, dotColor, '.' + THEME_TOGGLE_NAME, onColor, '.' + THEME_TOGGLE_NAME);
};
var createSelectStyles = function (_a) {
    var color = _a.color, backgroundColor = _a.backgroundColor, caretColor = _a.caretColor;
    return css(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n     ", " {\n      background: url(\"data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='", "' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>\") no-repeat;\n      background-position: calc(100% - 0.75rem) center !important;\n      -moz-appearance:none !important;\n      -webkit-appearance: none !important; \n      appearance: none !important;\n      padding-right: 2rem !important;\n      background-color: ", ";\n      color: ", ";\n      padding: 8px 14px;\n      border-radius: 18px;\n      text-transform: uppercase;\n      outline: none;\n      border: none;\n      font: 10px Helvetica;\n      font-weight: bold;\n    }\n  "], ["\n     ", " {\n      background: url(\"data:image/svg+xml,<svg height='10px' width='10px' viewBox='0 0 16 16' fill='", "' xmlns='http://www.w3.org/2000/svg'><path d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/></svg>\") no-repeat;\n      background-position: calc(100% - 0.75rem) center !important;\n      -moz-appearance:none !important;\n      -webkit-appearance: none !important; \n      appearance: none !important;\n      padding-right: 2rem !important;\n      background-color: ", ";\n      color: ", ";\n      padding: 8px 14px;\n      border-radius: 18px;\n      text-transform: uppercase;\n      outline: none;\n      border: none;\n      font: 10px Helvetica;\n      font-weight: bold;\n    }\n  "])), '.' + THEME_SELECT_NAME, caretColor, backgroundColor, color);
};
var templateObject_1, templateObject_2;

var DEFAULT_CONTEXT = {
    themes: {},
    theme: '',
    setTheme: function () { }
};
/**
 * Initializes the theme context returns context, provider and helper hooks.
 *
 * @example
 * const themes = { your themes here };
 * const { Provider, ThemeToggle, useTheme } = initTheme(themes);
 * export {
 *  Provider,
 *  ThemeToggle,
 *  useTheme
 * };
 *
 * @param themes an object containing your themes.
 * @returns a theme context, provider and hooks for managing app themes.
 */
var initTheme = function (themes, generateSassVars) {
    if (generateSassVars === void 0) { generateSassVars = false; }
    if (!themes)
        throw new Error("A themes map of ThemeMap is required.");
    var Context = React.createContext(__assign(__assign({}, DEFAULT_CONTEXT), { themes: themes }));
    var Consumer = Context.Consumer;
    Context.displayName = 'ThemeContext';
    var styles = new Map();
    var storage = initLocalStorage();
    // iterate themes and flatten into css vars
    var themesFlat = Object.keys(themes).reduce(function (a, c) {
        a[c] = flattenTheme(themes[c], '--');
        return a;
    }, {});
    if (generateSassVars)
        Object.keys(themes).reduce(function (a, c) {
            a[c] = genSassVars(themes[c]);
            return a;
        }, {});
    function createStyle(idOrConf, rules, wrap) {
        if (wrap === void 0) { wrap = false; }
        var conf = idOrConf;
        if (typeof idOrConf !== 'object') {
            conf = {
                id: idOrConf,
                rules: rules,
                wrap: wrap
            };
        }
        if (styles.get(conf.id))
            throw new Error("Attempted to overwrite style `" + conf.id + "`.");
        styles.set(conf.id, conf);
    }
    var normalizeStyle = function (theme, id, rules, wrap, compact) {
        if (compact === void 0) { compact = false; }
        var _theme = themes[theme];
        var cssStr = typeof rules === 'function'
            ? rules(_theme)
            : rules;
        if (wrap) {
            var prefix = typeof wrap === 'string' ? wrap : '.';
            cssStr = "" + prefix + id + "{\n" + cssStr + "\n}";
        }
        if (compact)
            cssStr = cssStr.replace(/\n/g, '');
        return cssStr;
    };
    /**
     * Creates a provider giving access to the theme context.
     *
     * @example
     * <Provider defaultTheme="dark" >
     *  {children}
     * </Provider>
     *
     * @param props the child node and optional default theme.
     * @returns the theme context provider.
     */
    var Provider = function (props) {
        var _a = __read(React.useState(storage.init(props.theme)), 2), theme = _a[0], setTheme = _a[1];
        var themeSetter = function (nextTheme) {
            storage.set(nextTheme);
            setTheme(nextTheme);
        };
        var ensureVars = React.useCallback(function () {
            if (typeof document === 'undefined')
                return;
            var style = document.getElementById(THEME_NAME);
            if (!style) {
                style = document.createElement('style');
                style.setAttribute('id', THEME_NAME);
                document.head.appendChild(style);
            }
            var activeTheme = style === null || style === void 0 ? void 0 : style.dataset.theme;
            if (activeTheme !== theme) {
                style.setAttribute('data-theme', theme);
                style.innerHTML = ":root {" + themesFlat[theme].trim().replace(/\n/g, '') + "}";
            }
        }, [theme]);
        var mountStyles = React.useCallback(function () {
            styles.forEach(function (style) {
                var id = style.id, rules = style.rules, wrap = style.wrap, dynamic = style.dynamic, extracted = style.extracted, element = style.element;
                // shouldn't have dynamic here but...
                if (typeof document !== 'undefined' && (!dynamic && !extracted && !element)) {
                    var elem = document.createElement('style');
                    elem.setAttribute('id', style.id);
                    elem.innerHTML = normalizeStyle(theme, id, rules, wrap, true);
                    document.head.appendChild(elem);
                    style.element = elem;
                }
            });
        }, []);
        var value = React.useMemo(function () {
            ensureVars();
            mountStyles();
            return {
                themes: themes,
                theme: theme,
                setTheme: themeSetter
            };
        }, [theme, ensureVars]);
        return (React__default['default'].createElement(Context.Provider, { value: value }, props.children));
    };
    /**
     * Default hook used to create the context.
     *
     * @returns the IThemeContext
     */
    var useThemeContext = function () {
        var ctx = React.useContext(Context);
        if (!ctx.theme)
            console.error("Theme Context invalid: hook or Component used before mounting Provider.");
        return ctx;
    };
    /**
     * A hook that appends styles to the header by id.
     *
     * @example
     * appendStyle('my-style', css`.some-class { }`, 'my-style');
     *
     * @example
     * appendStyle('my-style', (theme) => css`.some-class { color: ${theme.font.color}}`,  true);
     *
     * @param rules the style's rules that should be applied.
     * @param id the id to use for saving the style element.
     * @param wrap when true wraps the element as .id_name { rules }
     * @returns the current theme context.
     */
    function appendStyle(id, rules, wrap) {
        var ctx = useThemeContext();
        useIsomorphicLayoutEffect(function () {
            if (!ctx || !rules || !ctx.theme || styles.get(id))
                return;
            var style = document.createElement('style');
            style.innerHTML = normalizeStyle(ctx.theme, id, rules, wrap, true);
            style.setAttribute('id', id);
            if (id === THEME_GLOBALS_NAME) {
                var parent_1 = document.head.querySelector('#' + THEME_NAME);
                appendAfter(style, parent_1);
            }
            else {
                document.head.appendChild(style);
            }
            createStyle({ id: id, element: style, dynamic: true });
        }, [id, rules, ctx.theme]);
    }
    /**
     * Theme switcher hooker provides setter, list of themes and active.
     *
     * @param animate when true background is animated on theme switch.
     * @returns a hook for switching the theme.
     */
    var useThemeSwitcher = function (animate) {
        if (animate === void 0) { animate = false; }
        var ctx = useThemeContext();
        var setTheme = function (nextTheme) {
            if (!animate) {
                ctx.setTheme(nextTheme);
                return;
            }
            var body = document.body;
            body.classList.add('fadeIn');
            ctx.setTheme(nextTheme);
            setTimeout(function () {
                body.classList.remove('fadeIn');
            }, 300);
        };
        return {
            theme: ctx.theme,
            themes: Object.keys(ctx.themes),
            setTheme: setTheme
        };
    };
    /**
     * Theme hook provides access to the theme context.
     */
    var useTheme = function () {
        var ctx = useThemeContext();
        // const _addStyle = (id: string, rules: Rules) => {
        // };
        return ctx.themes[ctx.theme];
    };
    /**
     * A null component that allows you to add styles inline as a component.
     *
     * @param props theme style component options.
     * @returns a nullable component.
     */
    var ThemeStyles = function (_a) {
        var id = _a.id, children = _a.children, rules = _a.rules;
        id = id || genUID();
        rules = (children || rules);
        appendStyle(id, rules);
        return null;
    };
    /**
     * A wrapper to which returns a null component but creates a style.
     *
     * @param props options for global theme.
     * @returns a ThemeStyles nullable component.
     */
    var ThemeGlobals = function (props) {
        var id = THEME_GLOBALS_NAME;
        return (React__default['default'].createElement(ThemeStyles, __assign({}, props, { id: id })));
    };
    /**
    * Provides a drop down selector to change to the desired theme.
    *
    * @example
    * <ThemeSwitcher animate  />
    *
    * @param props theme switcher options and select attributes.
    * @returns a select element for selecting a theme.
    */
    var ThemeSelector = function (props) {
        props = __assign({ color: '#fff', backgroundColor: '#323438', caretColor: '#bbbbff' }, props);
        props.caretColor = (props.caretColor || '').replace('#', '%23');
        var _a = props, animate = _a.animate, color = _a.color, backgroundColor = _a.backgroundColor, caretColor = _a.caretColor, rest = __rest(_a, ["animate", "color", "backgroundColor", "caretColor"]);
        var _b = useThemeSwitcher(animate), themes = _b.themes, setTheme = _b.setTheme, theme = _b.theme;
        var _c = __read(React.useState(''), 2), activeTheme = _c[0], setActiveTheme = _c[1];
        appendStyle(THEME_SELECT_NAME, createSelectStyles({ color: color, backgroundColor: backgroundColor, caretColor: caretColor }));
        React.useEffect(function () {
            setActiveTheme(theme);
        }, [theme, setTheme]);
        var getOptions = function () {
            return themes.map(function (item) {
                return (React__default['default'].createElement("option", { key: item, value: item, defaultChecked: item === theme }, item));
            });
        };
        return (React__default['default'].createElement("select", __assign({}, rest, { className: THEME_SELECT_NAME, value: activeTheme, onChange: function (e) { return setTheme(e.currentTarget.value); } }), getOptions()));
    };
    /**
     * Creates toggle switch for switching between two themes.
     * NOTE: onChange noop is not in error this is required for
     * bound checkboxes however onChange cannot be used as it will
     * not fire on first mount. This is but one way of handling this.
     *
     * @example
     * <ThemeToggle animate darkColor="#333" on="dark" off="light" />
     *
     * @param props theme toggle options and input attributes.
     * @returns an input toggle to switch between two themes.
     */
    var ThemeToggle = function (props) {
        props = __assign({ onColor: '#323438', offColor: '#9a9ca3', dotColor: '#cacaca', color: '#ffffff' }, props);
        var _a = props, animate = _a.animate, on = _a.on, off = _a.off, offColor = _a.offColor, onColor = _a.onColor, dotColor = _a.dotColor, color = _a.color, rest = __rest(_a, ["animate", "on", "off", "offColor", "onColor", "dotColor", "color"]);
        var allowedThemes = [off, on];
        var _b = useThemeSwitcher(animate), theme = _b.theme, setTheme = _b.setTheme;
        var _c = __read(React.useState(''), 2), activeTheme = _c[0], setActiveTheme = _c[1];
        appendStyle(THEME_TOGGLE_NAME, createToggleStyles({ offColor: offColor, onColor: onColor, dotColor: dotColor, color: color }));
        React.useEffect(function () {
            setActiveTheme(theme);
        }, [theme, setTheme]);
        if (!allowedThemes.includes(theme)) {
            console.warn("Toggle themes [" + allowedThemes.join(', ') + "] does not contain active theme: " + theme);
            return null;
        }
        return (React__default['default'].createElement("input", __assign({ type: "checkbox", className: THEME_TOGGLE_NAME, onClick: function () { return setTheme(theme === on ? off : on); }, checked: activeTheme === on || theme === on, onChange: noop }, rest)));
    };
    if (module.hot) {
        module.hot.dispose(function () {
            styles.forEach(function (style) {
                if (document && style.element && document.head.contains(style.element))
                    document.head.removeChild(style.element);
            });
            styles.clear();
        });
    }
    return {
        Context: Context,
        Consumer: Consumer,
        Provider: Provider,
        createStyle: createStyle,
        useTheme: useTheme,
        useThemeContext: useThemeContext,
        useThemeSwitcher: useThemeSwitcher,
        ThemeGlobals: ThemeGlobals,
        ThemeStyles: ThemeStyles,
        ThemeSelector: ThemeSelector,
        ThemeToggle: ThemeToggle
    };
};

var SHADES_BASE = {
    red: 'hsl(357, 91%, 55%)',
    orange: 'hsl(17, 100%, 64%)',
    yellow: 'hsl(54, 100%, 62%)',
    green: 'hsl(98, 62%, 53%)',
    blue: 'hsl(207, 100%, 63%)',
    purple: 'hsl(267, 68%, 60%)',
    magenta: 'hsl(329, 91%, 66%)',
    gray: 'hsl(205, 8%, 49%)'
};
var THEME_BASE = {
    _config: {},
    html: {
        font: {
            size: '62.5%'
        }
    },
    body: {
        background: '#fff',
    },
    color: {
        primary: 'hsl(210, 95%, 45%)',
        success: 'hsl(158, 65%, 40%)',
        warning: 'hsl(26, 89%, 64%)',
        danger: 'hsl(349, 75%, 57%)',
        dim: 'hsl(0, 0%, 65%)',
        dark: 'hsl(205, 8%, 28%)',
        white: 'hsl(0, 100%, 100%)',
        black: 'hsl(0, 0%, 0%)'
    },
    font: {
        family: {
            normal: '-apple-system, system-ui, BlinkMacSystemFont, Roboto, Helvetica Neue, Segoe UI, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol',
            mono: 'SF Mono, Segoe UI Mono, Roboto Mono, Menlo, Courier, monospace'
        },
        color: '#333',
        size: '1.6rem',
        weight: 300
    },
    position: {
        spacer: '.5rem',
        margin: '1.25rem',
        padding: '1.25rem'
    },
    radius: {
        small: '.2rem',
        normal: '.4rem',
        large: '.6rem'
    },
    close: {
        small: '1.4rem',
        normal: '2rem',
        large: '2.8rem'
    },
    button: {
        font: {
            normal: '.8em',
            small: '.65em',
            large: '1.2em',
        },
        height: {
            small: '3rem',
            normal: '3.8rem',
            large: '5.5rem',
        },
        loading: {
            height: {
                small: '1.6em',
                large: '1.6em',
                normal: '1.6em',
            }
        },
        darken: {
            normal: '8%',
            outlined: '15%'
        }
    },
    toggle: {
        switch: {
            speed: '.15s',
            timing: 'ease-in'
        },
        width: {
            small: '2.5rem',
            normal: '4rem',
            large: '5.6em'
        },
        height: {
            small: '1.5rem',
            normal: '2rem',
            large: '3em'
        },
        gutter: {
            small: '.2rem',
            normal: '.2rem',
            large: '.3rem'
        },
        radius: {
            small: '50%',
            normal: '50%',
            large: '50%'
        },
    },
    slider: {
        width: '100%',
        handle: {
            small: '1rem',
            normal: '1.5rem',
            large: '2rem'
        },
        height: {
            small: '.25rem',
            normal: '.35rem',
            large: '.4rem'
        }
    },
    step: {
        marker: {
            xsmall: '1.4rem',
            small: '2rem',
            normal: '3rem',
            large: '4.5rem'
        },
        bar: {
            xsmall: '.24rem',
            small: '.3rem',
            normal: '.4rem',
            large: '.4rem'
        },
        border: {
            xsmall: '.2rem',
            small: '.2rem',
            normal: '.275rem',
            large: '.375rem'
        }
    },
    pager: {
        height: {
            small: '3rem',
            normal: '4rem',
            large: '6rem'
        }
    }
};
/**
 * Generate light versions of semantic colors.
 *
 * @param theme the current theme.
 * @param semanticColors an array of semantic color keys.
 * @returns the current theme.
 */
var createSemanticLight = function (colors, semanticColors) {
    if (semanticColors === void 0) { semanticColors = ['primary', 'danger', 'warning', 'success']; }
    return semanticColors.reduce(function (a, c) {
        if (colors[c + 'Light'] !== '')
            return a;
        a[c + 'Light'] = tinycolor__default['default'](colors[c]).lighten(0.8).toHslString();
        return a;
    }, colors);
};
/**
 * Creates object of color shades based on base color.
 *
 * @param color the base color to create shades from.
 * @returns an object containing shades from 100-900
 */
var createShades = function (color) {
    var colors = {
        100: '',
        200: '',
        300: '',
        400: '',
        500: '',
        600: '',
        700: '',
        800: '',
        900: ''
    };
    var keys = Object.keys(colors).reverse();
    var hsl = tinycolor__default['default'](color).toHsl();
    for (var i = keys.length - 1; i >= 0; i -= 1) {
        hsl.l = (i + 0.5) / keys.length;
        colors[keys[i]] = tinycolor__default['default'](hsl).toHslString();
    }
    return colors;
};
/**
 * Breaks out each color into Hue, Saturation and Lightness variables.
 *
 * @param colors the colors to be processed.
 * @returns the theme colors object.
 */
var breakoutColors = function (colors) {
    for (var k in colors) {
        var val = colors[k];
        // semantic colors
        if (typeof val === 'string') {
            var _a = tinycolor__default['default'](val).toHsl(), h = _a.h, s = _a.s, l = _a.l, a = _a.a;
            var hKey = k + 'H';
            var sKey = k + 'S';
            var lKey = k + 'L';
            var aKey = k + 'A';
            colors[hKey] = h.toFixed(0) + '';
            colors[sKey] = (s * 100).toFixed(0) + '%';
            colors[lKey] = (l * 100).toFixed(0) + '%';
            colors[aKey] = (a * 100).toFixed(0);
        }
        // shades
        else if (typeof val === 'object' && !Array.isArray(val)) {
            colors[k] = breakoutColors(colors[k]);
        }
    }
    return colors;
};
/**
 * A simple merge to merge two objects preserving the target
 * if the source value is undefined. This largely ensures our typings also.
 *
 * @example
 * const themeNode =
 *   mergeThemeNode({ font: { size: '1rem'}}, { font: { size: '.9rem', weight: 400  } });
 * themeNode = { font: { size: '1rem', size: 400 }};
 *
 * @param target the target node to be merged.
 * @param source the source node to merge with.
 * @returns the resulting merged theme node.
 */
var mergeThemeNode = function (target, source) {
    if (source === void 0) { source = {}; }
    var _target = __assign({}, target);
    for (var k in source) {
        if (!Array.isArray(source[k]) && typeof source[k] === 'object' && source[k] !== null) {
            _target[k] = mergeThemeNode(target[k] || {}, source[k]);
        }
        else if (typeof source[k] !== 'undefined') {
            _target[k] = source[k];
        }
    }
    return _target;
};
/**
 * Merges theme prerving default values when source value is undefined.
 * Creates clone when overrides not present.
 *
 * @param overrides properties to override the base theme with.
 * @returns a new overridden theme.
 */
var createTheme = function (overrides, shades, base) {
    if (shades === void 0) { shades = SHADES_BASE; }
    if (base === void 0) { base = THEME_BASE; }
    var theme = mergeThemeNode(__assign({}, base), overrides || {});
    var colorShades = Object.keys(shades).reduce(function (a, c) {
        a[c] = createShades(shades[c]);
        return a;
    }, {});
    theme.color = mergeThemeNode(theme.color, colorShades);
    // theme.color = createSemanticLight(theme.color);
    theme.color = breakoutColors(theme.color);
    return theme;
};
var light = createTheme();
var dark = createTheme({
    body: {
        background: '#12162b'
    },
    font: {
        color: '#fefefe'
    }
});
var THEMES = {
    light: light,
    dark: dark
};
// primaryLight: 'hsl(210, 100%, 36%)',
// successLight: 'hsl(158, 78%, 43%)',
// warningLight: 'hsl(26, 89%, 64%)',
// dangerLight: 'hsl(349, 75%, 57%)',
// grayDarker: '#2e2e2e',
// grayDark: '#3e3e3e',
// gray: '#737e86',
// grayLight: '#d1d1d1',
// grayLighter: '#e1e1e1',
// grayLightest: '#f4f5f6',

exports.CLOSE_STYLE = CLOSE_STYLE;
exports.CONTAINER_STYLES = CONTAINER_STYLES;
exports.Consumer = Consumer;
exports.Context = Context;
exports.ITEM_STYLE = ITEM_STYLE;
exports.NotifyController = NotifyController;
exports.Pane = Pane;
exports.Portal = Portal;
exports.Provider = Provider;
exports.SHADES_BASE = SHADES_BASE;
exports.THEMES = THEMES;
exports.THEME_BASE = THEME_BASE;
exports.THEME_GLOBALS_NAME = THEME_GLOBALS_NAME;
exports.THEME_NAME = THEME_NAME;
exports.Tab = Tab;
exports.Tabs = Tabs;
exports.appendAfter = appendAfter;
exports.breakoutColors = breakoutColors;
exports.createPaginator = createPaginator;
exports.createScaleDown = createScaleDown;
exports.createScaleUp = createScaleUp;
exports.createSemanticLight = createSemanticLight;
exports.createShades = createShades;
exports.createTheme = createTheme;
exports.css = css;
exports.flattenTheme = flattenTheme;
exports.fromCSSVar = fromCSSVar;
exports.genSassVars = genSassVars;
exports.genUID = genUID;
exports.getContainerStyle = getContainerStyle;
exports.getScale = getScale;
exports.initLocalStorage = initLocalStorage;
exports.initTheme = initTheme;
exports.mergeThemeNode = mergeThemeNode;
exports.noop = noop;
exports.round = round;
exports.scaleDown = scaleDown;
exports.scaleUp = scaleUp;
exports.toCSSVar = toCSSVar;
exports.toPixels = toPixels;
exports.toRem = toRem;
exports.useContext = useContext;
exports.useCreateController = useCreateController;
exports.useIsomorphicLayoutEffect = useIsomorphicLayoutEffect;
exports.useLastRef = useLastRef;
exports.useNotify = useNotify;
exports.usePager = usePager;
exports.usePortal = usePortal;
exports.useTabs = useTabs;
exports.useTimeout = useTimeout;
exports.useUpdate = useUpdate;
