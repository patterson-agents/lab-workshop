/* @ds-bundle: {"format":4,"namespace":"PattersonCompaniesDesignSystem_3534f9","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"PATTERSON_ICONS","sourcePath":"components/core/Icon.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Stat","sourcePath":"components/core/Stat.jsx"},{"name":"Alert","sourcePath":"components/feedback/Alert.jsx"},{"name":"Tabs","sourcePath":"components/feedback/Tabs.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"7e214be36871","components/core/Button.jsx":"0387942c008e","components/core/Card.jsx":"11a14798d6f8","components/core/Icon.jsx":"850343d56d92","components/core/IconButton.jsx":"b941fece5662","components/core/Stat.jsx":"e0e1d164ae78","components/feedback/Alert.jsx":"60554ac14775","components/feedback/Tabs.jsx":"579ba456e9bc","components/forms/Checkbox.jsx":"4f93f0dc4f95","components/forms/Input.jsx":"148131ac223c","components/forms/Radio.jsx":"04b993d678a7","components/forms/Select.jsx":"6768c7548eef","components/forms/Switch.jsx":"a2ba3bcb1dc7","integrations/tailwind.config.js":"ce1af7c16f23","integrations/theme-ui.js":"0a32db4d6bb9","integrations/uno.config.js":"9ab76204db05"},"inlinedExternals":[],"unexposedExports":[{"name":"meta","sourcePath":"integrations/theme-ui.js"},{"name":"pattersonPreset","sourcePath":"integrations/uno.config.js"},{"name":"pattersonTheme","sourcePath":"integrations/theme-ui.js"},{"name":"shortcuts","sourcePath":"integrations/uno.config.js"},{"name":"theme","sourcePath":"integrations/theme-ui.js"}]} */

(() => {

const __ds_ns = (window.PattersonCompaniesDesignSystem_3534f9 = window.PattersonCompaniesDesignSystem_3534f9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small status/label badge. Tone draws from the brand + semantic palette.
 */
function Badge({
  children,
  tone = 'navy',
  solid = false,
  style,
  ...rest
}) {
  const tones = {
    navy: {
      fg: 'var(--pat-navy)',
      bg: 'var(--pat-navy-10)',
      solidBg: 'var(--pat-navy)'
    },
    sky: {
      fg: 'var(--pat-blue)',
      bg: 'var(--pat-sky-10)',
      solidBg: 'var(--pat-sky)'
    },
    green: {
      fg: '#3d7a1f',
      bg: '#eef6e6',
      solidBg: 'var(--pat-green)'
    },
    teal: {
      fg: 'var(--pat-teal)',
      bg: 'var(--pat-success-bg)',
      solidBg: 'var(--pat-teal)'
    },
    purple: {
      fg: 'var(--pat-purple)',
      bg: '#efe9f6',
      solidBg: 'var(--pat-purple)'
    },
    gray: {
      fg: 'var(--pat-gray-600)',
      bg: 'var(--pat-gray-100)',
      solidBg: 'var(--pat-gray-600)'
    },
    warning: {
      fg: 'var(--pat-warning)',
      bg: 'var(--pat-warning-bg)',
      solidBg: 'var(--pat-warning)'
    },
    danger: {
      fg: 'var(--pat-danger)',
      bg: 'var(--pat-danger-bg)',
      solidBg: 'var(--pat-danger)'
    }
  };
  const t = tones[tone] || tones.navy;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-xs)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-wide)',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      color: solid ? '#fff' : t.fg,
      background: solid ? t.solidBg : t.bg,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Patterson action button — production-accurate.
 *
 * Verified against the live theme (theme-styles.min.css):
 *   .btn            border-radius 5px, 15px/30px padding, 15px/600
 *   .btn-primary    navy #003767 → hover #315D83 (a LIGHTER NAVY, not sky)
 *   .btn-secondary  filled light blue #6DCFF6 with a navy label → #96DBF6
 * `pill` opts into this design system's rounder convention, which does
 * not exist in production. `outline` / `ghost` / `onDark` are system
 * additions for surfaces production does not cover.
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  fullWidth = false,
  disabled = false,
  iconLeft = null,
  iconRight = null,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: {
      padding: '9px 20px',
      font: 'var(--fs-sm)'
    },
    md: {
      padding: 'var(--btn-pad-y) var(--btn-pad-x)',
      font: 'var(--pt-btn-size)'
    },
    lg: {
      padding: '18px 36px',
      font: 'var(--fs-h5)'
    }
  };
  const s = sizes[size] || sizes.md;
  const variants = {
    primary: {
      background: 'var(--btn-primary-bg)',
      color: 'var(--btn-primary-fg)',
      border: '0',
      hover: 'var(--btn-primary-bg-hover)',
      disabledBg: 'var(--btn-primary-bg-disabled)'
    },
    secondary: {
      background: 'var(--btn-secondary-bg)',
      color: 'var(--btn-secondary-fg)',
      border: '0',
      hover: 'var(--btn-secondary-bg-hover)',
      disabledBg: 'var(--btn-secondary-bg-disabled)'
    },
    sky: {
      background: 'var(--pat-sky)',
      color: '#fff',
      border: '0',
      hover: 'var(--pat-sky-80)',
      disabledBg: 'var(--pat-sky-40)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--pat-navy)',
      border: 'var(--border-w-thick) solid var(--pat-navy)',
      hover: 'var(--pat-navy)',
      hoverFg: '#fff'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--pat-navy)',
      border: 'var(--border-w-thick) solid transparent',
      hover: 'var(--pat-navy-10)'
    },
    onDark: {
      background: '#fff',
      color: 'var(--pat-navy)',
      border: '0',
      hover: 'var(--pat-blue-light)'
    }
  };
  const v = variants[variant] || variants.primary;
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: s.padding,
    width: fullWidth ? '100%' : 'auto',
    fontFamily: 'var(--font-sans)',
    fontSize: s.font,
    fontWeight: 'var(--pt-btn-weight)',
    lineHeight: 'var(--pt-btn-lh)',
    letterSpacing: 'var(--ls-normal)',
    textAlign: 'center',
    textDecoration: 'none',
    borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-btn)',
    background: disabled && v.disabledBg ? v.disabledBg : v.background,
    color: v.color,
    border: v.border,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled && !v.disabledBg ? 0.45 : 1,
    transition: 'background-color var(--dur-prod-base) var(--ease-prod), border-color var(--dur-prod-base) var(--ease-prod), color var(--dur-prod-base) var(--ease-prod)',
    whiteSpace: 'nowrap',
    ...style
  };
  const hoverIn = e => {
    if (disabled) return;
    const el = e.currentTarget;
    el.style.background = v.hover;
    if (v.hoverFg) el.style.color = v.hoverFg;
    if (variant === 'outline') el.style.borderColor = 'var(--pat-navy)';
  };
  const hoverOut = e => {
    if (disabled) return;
    const el = e.currentTarget;
    el.style.background = v.background;
    el.style.color = v.color;
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: base,
    onMouseEnter: hoverIn,
    onMouseLeave: hoverOut,
    onFocus: e => {
      e.currentTarget.style.boxShadow = 'var(--ring-focus)';
    },
    onBlur: e => {
      e.currentTarget.style.boxShadow = 'none';
    }
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Surface container. Clean white card with soft navy-tinted shadow and a
 * subtle border. Optional accent stripe along the top in a brand color.
 */
function Card({
  children,
  elevation = 'sm',
  accent = null,
  padding = 'var(--space-5)',
  interactive = false,
  style,
  ...rest
}) {
  const shadows = {
    none: 'none',
    xs: 'var(--shadow-xs)',
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)'
  };
  const accents = {
    navy: 'var(--pat-navy)',
    sky: 'var(--pat-sky)',
    green: 'var(--pat-green)',
    teal: 'var(--pat-teal)',
    purple: 'var(--pat-purple)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }
    },
    onMouseLeave: e => {
      if (interactive) {
        e.currentTarget.style.boxShadow = shadows[elevation];
        e.currentTarget.style.transform = 'translateY(0)';
      }
    },
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: shadows[elevation] || shadows.sm,
      borderTop: accent ? `4px solid ${accents[accent] || accent}` : undefined,
      padding,
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      cursor: interactive ? 'pointer' : undefined,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Patterson icon — renders a glyph from the OFFICIAL Patterson icon font
 * (93 glyphs, extracted from the production storefront pattern library).
 *
 * Because it is a font, the glyph inherits `color` from its context and
 * scales with `size`. There is no stroke to set.
 *
 * <Icon name="cart" />
 * <Icon name="chevron-right" size="sm" color="var(--pat-sky)" />
 */
const PATTERSON_ICONS = ['action-gallery', 'action-lightbox', 'action-play', 'alert', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'cart', 'chat', 'chat_alt', 'check', 'check_alt', 'chevron-down', 'chevron-down_light', 'chevron-left', 'chevron-left_light', 'chevron-right', 'chevron-right_light', 'chevron-up', 'chevron-up_light', 'close', 'close_light', 'close_medium', 'collapse', 'document', 'down-caret', 'down-right-arrow', 'download', 'email', 'excel', 'expand', 'external-link', 'facebook', 'facebook_alt', 'facebook_alt_bold', 'filter', 'formulary-list', 'gear', 'grid', 'hazmat', 'help', 'house', 'info', 'instagram', 'instagram_alt', 'instagram_outline', 'linkedin', 'linkedin_filled', 'list', 'list-1', 'locator', 'locked', 'mail', 'map-pin', 'map-pin_alt_outline', 'menu-dots', 'menu-lines', 'menu-lines_thin', 'pause', 'pdf', 'pedigree', 'phone', 'pinterest', 'pinterest_alt', 'play', 'plus_circle', 'prescription', 'previouslypurchased', 'promotion', 'question-mark', 'reddit', 'remove', 'search', 'search_alt', 'shiponice', 'shipping', 'snapchat', 'speech-bubbles', 'tag-percentage', 'tag-price', 'toggle-gridview', 'toggle-listview', 'trash', 'twitter', 'twitter_alt', 'up-caret', 'upload', 'user', 'user_alt', 'user_bold', 'youtube', 'youtube_alt'];
const SIZES = {
  sm: 'var(--icon-size-sm)',
  md: 'var(--icon-size-md)',
  lg: 'var(--icon-size-lg)'
};
function Icon({
  name,
  size = 'md',
  color,
  label,
  style,
  ...rest
}) {
  const resolved = SIZES[size] || size;
  return /*#__PURE__*/React.createElement("i", _extends({
    className: `pat-i pat-i-${name}`,
    "aria-hidden": label ? undefined : 'true',
    "aria-label": label,
    role: label ? 'img' : undefined,
    style: {
      fontSize: resolved,
      color: color || 'inherit',
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { PATTERSON_ICONS, Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Circular icon-only button. Pass an icon (SVG / glyph) as children.
 * Sized to meet the 44px hit-target minimum at md.
 */
function IconButton({
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  label,
  onClick,
  style,
  ...rest
}) {
  const dims = {
    sm: 34,
    md: 44,
    lg: 54
  };
  const d = dims[size] || dims.md;
  const variants = {
    solid: {
      background: 'var(--pat-navy)',
      color: '#fff'
    },
    sky: {
      background: 'var(--pat-sky)',
      color: '#fff'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--pat-navy)'
    },
    subtle: {
      background: 'var(--pat-navy-10)',
      color: 'var(--pat-navy)'
    }
  };
  const v = variants[variant] || variants.ghost;
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: e => {
      if (!disabled && variant === 'ghost') e.currentTarget.style.background = 'var(--pat-navy-10)';
    },
    onMouseLeave: e => {
      if (variant === 'ghost') e.currentTarget.style.background = 'transparent';
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: d,
      height: d,
      borderRadius: 'var(--radius-pill)',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...v,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Stat.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Big-number statistic, as used across Patterson marketing ("86,000,000
 * U.S. households have pets"). Number in sky or navy, label beneath.
 */
function Stat({
  value,
  label,
  tone = 'sky',
  align = 'left',
  style,
  ...rest
}) {
  const colors = {
    sky: 'var(--pat-sky)',
    navy: 'var(--pat-navy)',
    teal: 'var(--pat-teal)',
    green: 'var(--pat-green)'
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontSize: 'var(--fs-stat)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-tight)',
      lineHeight: 1,
      color: colors[tone] || colors.sky
    }
  }, value), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '10px',
      fontSize: 'var(--fs-body)',
      lineHeight: 'var(--lh-snug)',
      color: 'var(--text-body)',
      maxWidth: '22ch',
      marginInline: align === 'center' ? 'auto' : undefined
    }
  }, label));
}
Object.assign(__ds_scope, { Stat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stat.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Alert.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Inline message banner. Tone sets accent + tint; optional title & dismiss. */
function Alert({
  children,
  tone = 'info',
  title,
  onClose,
  icon,
  style,
  ...rest
}) {
  const tones = {
    info: {
      fg: 'var(--pat-info)',
      bg: 'var(--pat-info-bg)',
      bar: 'var(--pat-info)'
    },
    success: {
      fg: 'var(--pat-success)',
      bg: 'var(--pat-success-bg)',
      bar: 'var(--pat-success)'
    },
    warning: {
      fg: 'var(--pat-warning)',
      bg: 'var(--pat-warning-bg)',
      bar: 'var(--pat-warning)'
    },
    danger: {
      fg: 'var(--pat-danger)',
      bg: 'var(--pat-danger-bg)',
      bar: 'var(--pat-danger)'
    },
    brand: {
      fg: 'var(--pat-navy)',
      bg: 'var(--pat-navy-10)',
      bar: 'var(--pat-sky)'
    }
  };
  const t = tones[tone] || tones.info;
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "status",
    style: {
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
      background: t.bg,
      borderLeft: `4px solid ${t.bar}`,
      borderRadius: 'var(--radius-md)',
      padding: 'var(--space-4)',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.fg,
      display: 'flex',
      flex: 'none',
      marginTop: '1px'
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'var(--fw-bold)',
      color: 'var(--text-heading)',
      fontSize: 'var(--fs-body)',
      marginBottom: children ? '2px' : 0
    }
  }, title), children && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--fs-sm)',
      color: 'var(--text-body)',
      lineHeight: 'var(--lh-body)'
    }
  }, children)), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Dismiss",
    style: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: 'var(--text-muted)',
      display: 'flex',
      padding: 0,
      marginTop: '1px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6 6 18M6 6l12 12"
  }))));
}
Object.assign(__ds_scope, { Alert });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Alert.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tabs.jsx
try { (() => {
/**
 * Horizontal tabs with a sky underline indicator. Controlled via `value`
 * or uncontrolled via `defaultValue`.
 */
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  style
}) {
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? (tabs[0] && (typeof tabs[0] === 'string' ? tabs[0] : tabs[0].value)));
  const active = isControlled ? value : internal;
  const select = val => {
    if (!isControlled) setInternal(val);
    onChange && onChange(val);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '4px',
      borderBottom: '1px solid var(--border-subtle)',
      ...style
    }
  }, tabs.map(t => {
    const val = typeof t === 'string' ? t : t.value;
    const lbl = typeof t === 'string' ? t : t.label;
    const on = active === val;
    return /*#__PURE__*/React.createElement("button", {
      key: val,
      onClick: () => select(val),
      onMouseEnter: e => {
        if (!on) e.currentTarget.style.color = 'var(--pat-navy)';
      },
      onMouseLeave: e => {
        if (!on) e.currentTarget.style.color = 'var(--text-muted)';
      },
      style: {
        appearance: 'none',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '12px 16px',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--fs-body)',
        fontWeight: on ? 'var(--fw-bold)' : 'var(--fw-medium)',
        color: on ? 'var(--pat-navy)' : 'var(--text-muted)',
        borderBottom: `3px solid ${on ? 'var(--pat-sky)' : 'transparent'}`,
        marginBottom: '-1px',
        transition: 'color var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)'
      }
    }, lbl);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox with brand sky fill when checked. Controlled or uncontrolled. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const cbId = id || `cb-${Math.random().toString(36).slice(2, 8)}`;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: cbId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: cbId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: !isControlled ? defaultChecked : undefined,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flex: 'none',
      borderRadius: 'var(--radius-sm)',
      border: `2px solid ${on ? 'var(--pat-sky)' : 'var(--border-strong)'}`,
      background: on ? 'var(--pat-sky)' : 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-standard)'
    }
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6 9 17l-5-5"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Text input with label, optional helper/error text and sky focus ring.
 */
function Input({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  helper,
  error,
  disabled = false,
  required = false,
  iconLeft = null,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || `inp-${Math.random().toString(36).slice(2, 8)}`;
  const borderColor = error ? 'var(--pat-danger)' : focused ? 'var(--pat-sky)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-heading)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--pat-danger)'
    }
  }, " *")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: '14px',
      color: 'var(--text-muted)',
      display: 'flex'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    required: required,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      width: '100%',
      height: 'var(--control-h-md)',
      padding: iconLeft ? '0 14px 0 42px' : '0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-heading)',
      background: disabled ? 'var(--surface-muted)' : 'var(--surface-card)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focused && !error ? 'var(--ring-focus)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)',
      boxSizing: 'border-box'
    }
  }, rest))), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-xs)',
      color: error ? 'var(--pat-danger)' : 'var(--text-muted)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio button in a RadioGroup. Use within Radio.Group for selection state. */
function Radio({
  label,
  value,
  checked,
  onChange,
  name,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const rId = id || `rd-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: rId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: rId,
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    onChange: onChange,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      flex: 'none',
      borderRadius: '50%',
      border: `2px solid ${checked ? 'var(--pat-sky)' : 'var(--border-strong)'}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all var(--dur-fast) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--pat-sky)',
      transform: checked ? 'scale(1)' : 'scale(0)',
      transition: 'transform var(--dur-fast) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
}

/** Convenience group: renders radios from options and manages selection. */
Radio.Group = function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  direction = 'column',
  gap = '12px',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: direction,
      gap,
      ...style
    }
  }, options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement(Radio, {
      key: val,
      name: name,
      value: val,
      label: lbl,
      checked: value === val,
      onChange: () => onChange && onChange(val)
    });
  }));
};
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Styled native select with brand chevron and focus ring. */
function Select({
  label,
  id,
  value,
  defaultValue,
  onChange,
  options = [],
  disabled = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const selId = id || `sel-${Math.random().toString(36).slice(2, 8)}`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selId,
    style: {
      fontSize: 'var(--fs-sm)',
      fontWeight: 'var(--fw-semibold)',
      color: 'var(--text-heading)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selId,
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    disabled: disabled,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 'var(--control-h-md)',
      padding: '0 40px 0 14px',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--fs-body)',
      color: 'var(--text-heading)',
      background: disabled ? 'var(--surface-muted)' : 'var(--surface-card)',
      border: `1.5px solid ${focused ? 'var(--pat-sky)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focused ? 'var(--ring-focus)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, rest), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: '14px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--pat-navy)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Toggle switch; sky track when on. Controlled or uncontrolled. */
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  style,
  ...rest
}) {
  const swId = id || `sw-${Math.random().toString(36).slice(2, 8)}`;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = e => {
    if (disabled) return;
    if (!isControlled) setInternal(e.target.checked);
    onChange && onChange(e);
  };
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: swId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '12px',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("input", _extends({
    id: swId,
    type: "checkbox",
    checked: isControlled ? checked : undefined,
    defaultChecked: !isControlled ? defaultChecked : undefined,
    onChange: toggle,
    disabled: disabled,
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 26,
      flex: 'none',
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--pat-sky)' : 'var(--border-strong)',
      padding: 3,
      boxSizing: 'border-box',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: on ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--fs-body)',
      color: 'var(--text-body)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// integrations/tailwind.config.js
try { (() => {
/**
 * Patterson Companies — Tailwind config (v3-style / JS)
 * -------------------------------------------------------------
 * Prefer integrations/tailwind.css (the CSS-first v4 theme) when you can.
 * Use THIS file if you are on Tailwind v3, or on v4 but loading a JS config
 * with `@config "./tailwind.config.js";`.
 *
 * All values mirror tokens/*.css and theme.json. Spacing is intentionally
 * left as Tailwind's default (0.25rem base = Patterson's 4px grid).
 *
 *   // tailwind.config.js
 *   import patterson from '@patterson/design-system/integrations/tailwind.config.js';
 *   export default { presets: [patterson], content: ['./src/**\/*.{html,js,jsx,ts,tsx}'] };
 */
const navy = '#003767';
const sky = '#00A8E1';

/** @type {import('tailwindcss').Config} */
let __ds_default_integrations_tailwind_config_14spesr;
try {
  __ds_default_integrations_tailwind_config_14spesr = {
    theme: {
      extend: {
        fontFamily: {
          sans: ["proxima-nova", "Figtree", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
          display: ["proxima-nova", "Figtree", "system-ui", "sans-serif"],
          mono: ["IBM Plex Mono", "ui-monospace", "SF Mono", "Menlo", "Consolas", "monospace"]
        },
        colors: {
          navy: {
            DEFAULT: navy,
            80: "#335f85",
            60: "#6687a4",
            40: "#99afc2",
            20: "#ccd7e1",
            10: "#e5ebf0"
          },
          sky: {
            DEFAULT: sky,
            80: "#33b9e7",
            60: "#66caed",
            40: "#99dcf3",
            20: "#ccedf9",
            10: "#e5f6fc"
          },
          blue: "#147EC2",
          "blue-light": "#6DCFF6",
          green: "#7BC24D",
          teal: "#00817D",
          purple: "#522E91",
          // Interaction states (production-verified): primary hover is a
          // LIGHTER NAVY, not sky; secondary is a filled light blue.
          "primary-hover": "#315D83",
          "primary-disabled": "#93A9BC",
          "secondary-hover": "#96DBF6",
          "secondary-disabled": "#DAEDF5",
          // Warm taupe — the brand's one non-cool gray (input borders).
          "gray-warm": "#AFA593",
          "border-field": "#AFA593",
          "slider-nav": "#D9D9D9",
          ink: "#1d1d20",
          gray: {
            brand: "#58585B",
            700: "#46464a",
            600: "#58585B",
            500: "#7c7c80",
            400: "#a3a3a7",
            300: "#c9c9cc",
            200: "#e2e2e4",
            100: "#ECECEC",
            50: "#f6f7f8"
          },
          success: "#00817D",
          "success-bg": "#e5f2f1",
          info: "#147EC2",
          "info-bg": "#e7f1f9",
          warning: "#d98a00",
          "warning-bg": "#fbf1df",
          danger: "#c0392b",
          "danger-bg": "#f8eae8",
          // role aliases
          heading: "#1d1d20",
          body: "#58585B",
          muted: "#7c7c80",
          link: "#147EC2",
          border: "#e2e2e4",
          "border-strong": "#a3a3a7",
          surface: "#FFFFFF",
          "surface-subtle": "#f6f7f8",
          ring: sky
        },
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          body: "1rem",
          h5: "1.0625rem",
          lead: "1.25rem",
          h4: "1.25rem",
          h3: "clamp(1.375rem, 1.15rem + 0.8vw, 1.75rem)",
          h2: "clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)",
          h1: "clamp(2.25rem, 1.5rem + 2.6vw, 3.25rem)",
          display: "clamp(2.75rem, 1.6rem + 4.2vw, 4.5rem)",
          stat: "clamp(2.5rem, 1.4rem + 4vw, 4rem)"
        },
        // NOTE: the Patterson Proxima Nova kit ships only 400 and 700.
        // 300/500/600/800/900 are browser-synthesized (faux) bold.
        fontWeight: {
          light: "300",
          medium: "500",
          semibold: "600",
          bold: "700",
          extra: "800",
          black: "900"
        },
        lineHeight: {
          tight: "1.05",
          snug: "1.2",
          heading: "1.15",
          body: "1.6",
          relaxed: "1.75"
        },
        letterSpacing: {
          tight: "-0.02em",
          snug: "-0.01em",
          wide: "0.04em",
          caps: "0.08em"
        },
        borderRadius: {
          // Production-verified: 5px buttons, 2px fields. No pill in production.
          btn: "5px",
          "btn-elevated": "6px",
          field: "2px",
          xs: "2px",
          sm: "4px",
          md: "6px",
          lg: "10px",
          xl: "16px",
          "2xl": "24px",
          pill: "999px"
        },
        boxShadow: {
          xs: "0 1px 2px rgba(0, 55, 103, 0.06)",
          sm: "0 1px 3px rgba(0, 55, 103, 0.08), 0 1px 2px rgba(0, 55, 103, 0.06)",
          md: "0 4px 12px rgba(0, 55, 103, 0.10), 0 2px 4px rgba(0, 55, 103, 0.06)",
          lg: "0 12px 28px rgba(0, 55, 103, 0.12), 0 4px 10px rgba(0, 55, 103, 0.07)",
          xl: "0 24px 48px rgba(0, 55, 103, 0.16)"
        },
        maxWidth: {
          container: "1240px",
          text: "720px"
        },
        transitionTimingFunction: {
          standard: "cubic-bezier(0.2, 0, 0.2, 1)",
          out: "cubic-bezier(0.16, 1, 0.3, 1)"
        },
        transitionDuration: {
          fast: "120ms",
          base: "200ms",
          slow: "320ms"
        }
      }
    }
  };
} catch {}
Object.assign(__ds_scope, { __ds_default_integrations_tailwind_config_14spesr });
})(); } catch (e) { __ds_ns.__errors.push({ path: "integrations/tailwind.config.js", error: String((e && e.message) || e) }); }

// integrations/theme-ui.js
try { (() => {
/**
 * Patterson Companies — Theme UI theme
 * -------------------------------------------------------------
 * The canonical theme, shaped to the Theme UI spec:
 *   https://theme-ui.com/theme-spec  ·  https://theme-ui.com/theming
 *
 * Single source of truth is ../theme.json (which mirrors tokens/*.css).
 * This module imports it, drops the documentation-only `$` keys, and
 * exports a ready-to-use Theme UI theme — variants included.
 *
 * Usage (React):
 *   import { ThemeUIProvider } from 'theme-ui';
 *   import theme from '@patterson/design-system/integrations/theme-ui.js';
 *   <ThemeUIProvider theme={theme}>{app}</ThemeUIProvider>
 *
 * Then compose with the sx prop and variants, e.g.
 *   <button sx={{ variant: 'buttons.primary', px: 5, height: 'controlMd' }}>Shop</button>
 *   <h1 sx={{ variant: 'text.display' }}>Trusted Expertise.</h1>
 *   <div sx={{ variant: 'cards.interactive' }}>…</div>
 *
 * If your bundler does not support JSON import assertions, replace the
 * import below with a copy of theme.json's contents as a JS object literal.
 */

const {
  $schema,
  $meta,
  ...theme
} = raw;

/** Theme UI colours use `modes` for alternate palettes. Patterson ships a
 *  single light palette today; a navy "on-dark" surface is expressed through
 *  the `buttons.onDark` / `text.eyebrow` variants rather than a full mode. */
const meta = $meta;
const pattersonTheme = theme;
Object.assign(__ds_scope, { meta, pattersonTheme, theme, __ds_default_integrations_theme_ui_en7bgp: theme });
})(); } catch (e) { __ds_ns.__errors.push({ path: "integrations/theme-ui.js", error: String((e && e.message) || e) }); }

// integrations/uno.config.js
try { (() => {
/**
 * Patterson Companies — UnoCSS config
 * -------------------------------------------------------------
 * Import into your uno.config.js (or use as a preset). Uses presetWind4
 * (Tailwind-v4-compatible utilities) plus Patterson theme values and a set
 * of brand shortcuts that reproduce the component recipes as utilities.
 *
 *   import { defineConfig, presetWind4, presetIcons } from 'unocss';
 *   import { pattersonPreset } from '@patterson/design-system/integrations/uno.config.js';
 *
 *   export default defineConfig({
 *     presets: [presetWind4(), presetIcons({ scale: 1.1 }), pattersonPreset()],
 *   });
 *
 * Then: <button class="btn btn-primary">Shop</button>
 *       <div class="pat-card">…</div>
 *       <p class="eyebrow">Since 1877</p>
 *       <span class="stat">98%</span>
 *
 * This module intentionally does NOT import from 'unocss' itself — it is pure
 * theme data, so it can be consumed anywhere without a build step. You supply
 * defineConfig + presets in your own uno.config.js as shown above.
 */
const theme = {
  colors: {
    navy: {
      DEFAULT: '#003767',
      80: '#335f85',
      60: '#6687a4',
      40: '#99afc2',
      20: '#ccd7e1',
      10: '#e5ebf0'
    },
    sky: {
      DEFAULT: '#00A8E1',
      80: '#33b9e7',
      60: '#66caed',
      40: '#99dcf3',
      20: '#ccedf9',
      10: '#e5f6fc'
    },
    blue: '#147EC2',
    bluelight: '#6DCFF6',
    green: '#7BC24D',
    teal: '#00817D',
    purple: '#522E91',
    // Production-verified interaction states + the brand's warm taupe.
    primaryhover: '#315D83',
    primarydisabled: '#93A9BC',
    secondaryhover: '#96DBF6',
    secondarydisabled: '#DAEDF5',
    graywarm: '#AFA593',
    borderfield: '#AFA593',
    slidernav: '#D9D9D9',
    ink: '#1d1d20',
    gray: {
      brand: '#58585B',
      700: '#46464a',
      600: '#58585B',
      500: '#7c7c80',
      400: '#a3a3a7',
      300: '#c9c9cc',
      200: '#e2e2e4',
      100: '#ECECEC',
      50: '#f6f7f8'
    },
    success: '#00817D',
    info: '#147EC2',
    warning: '#d98a00',
    danger: '#c0392b',
    heading: '#1d1d20',
    body: '#58585B',
    muted: '#7c7c80',
    link: '#147EC2',
    border: '#e2e2e4',
    surface: '#FFFFFF',
    ring: '#00A8E1'
  },
  fontFamily: {
    sans: "'proxima-nova','Figtree',system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
    display: "'proxima-nova','Figtree',system-ui,sans-serif",
    mono: "'IBM Plex Mono',ui-monospace,'SF Mono',Menlo,Consolas,monospace"
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    body: '1rem',
    h5: '1.0625rem',
    lead: '1.25rem',
    h4: '1.25rem',
    h3: 'clamp(1.375rem, 1.15rem + 0.8vw, 1.75rem)',
    h2: 'clamp(1.75rem, 1.3rem + 1.6vw, 2.5rem)',
    h1: 'clamp(2.25rem, 1.5rem + 2.6vw, 3.25rem)',
    display: 'clamp(2.75rem, 1.6rem + 4.2vw, 4.5rem)',
    stat: 'clamp(2.5rem, 1.4rem + 4vw, 4rem)'
  },
  // Only 400 and 700 are licensed faces; the rest are synthesized.
  fontWeight: {
    light: '300',
    medium: '500',
    semibold: '600',
    bold: '700',
    extra: '800',
    black: '900'
  },
  lineHeight: {
    tight: '1.05',
    snug: '1.2',
    heading: '1.15',
    body: '1.6',
    relaxed: '1.75'
  },
  letterSpacing: {
    tight: '-0.02em',
    snug: '-0.01em',
    wide: '0.04em',
    caps: '0.08em'
  },
  // btn/btnElevated/field are production-verified; pill is system-only.
  borderRadius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '10px',
    xl: '16px',
    '2xl': '24px',
    pill: '999px',
    btn: '5px',
    btnElevated: '6px',
    field: '2px'
  },
  boxShadow: {
    xs: '0 1px 2px rgba(0,55,103,0.06)',
    sm: '0 1px 3px rgba(0,55,103,0.08), 0 1px 2px rgba(0,55,103,0.06)',
    md: '0 4px 12px rgba(0,55,103,0.10), 0 2px 4px rgba(0,55,103,0.06)',
    lg: '0 12px 28px rgba(0,55,103,0.12), 0 4px 10px rgba(0,55,103,0.07)',
    xl: '0 24px 48px rgba(0,55,103,0.16)',
    focus: '0 0 0 3px rgba(0,168,225,0.45)'
  },
  maxWidth: {
    container: '1240px',
    text: '720px'
  },
  easing: {
    standard: 'cubic-bezier(0.2,0,0.2,1)',
    out: 'cubic-bezier(0.16,1,0.3,1)'
  }
};

/* Component recipes as shortcuts — reproduce the .jsx primitives' looks. */
const shortcutsMap = {
  'eyebrow': 'text-xs font-bold tracking-caps uppercase text-sky',
  'stat': 'font-display text-stat font-bold leading-tight tracking-tight text-sky',
  'pat-container': 'w-full max-w-container mx-auto px-6',
  'pat-card': 'bg-surface border border-border rounded-lg shadow-sm p-6',
  'pat-card-interactive': 'pat-card transition-all duration-200 ease-standard hover:-translate-y-[3px] hover:shadow-lg',
  'btn': 'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-pill font-sans font-semibold leading-none cursor-pointer transition-colors duration-[120ms] ease-standard border-2',
  'btn-primary': 'btn bg-navy text-white border-navy hover:bg-sky hover:border-sky',
  'btn-sky': 'btn bg-sky text-white border-sky hover:bg-navy hover:border-navy',
  'btn-outline': 'btn bg-transparent text-navy border-navy hover:bg-navy hover:text-white',
  'btn-ghost': 'btn bg-transparent text-navy border-transparent hover:bg-navy-10',
  'btn-on-dark': 'btn bg-white text-navy border-white hover:bg-sky hover:text-white hover:border-sky',
  'input': 'w-full h-11 px-3 rounded-md border border-gray-300 bg-surface text-body font-sans focus-visible:(outline-none border-sky shadow-focus)',
  'badge': 'inline-flex items-center gap-1 px-3 py-1 rounded-pill text-xs font-semibold'
};
const shortcuts = shortcutsMap;

/** UnoCSS preset carrying the Patterson theme + brand shortcuts. */
function pattersonPreset() {
  return {
    name: 'patterson',
    theme,
    shortcuts: shortcutsMap
  };
}
Object.assign(__ds_scope, { shortcuts, pattersonPreset, __ds_default_integrations_uno_config_136e03l: pattersonPreset });
})(); } catch (e) { __ds_ns.__errors.push({ path: "integrations/uno.config.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.PATTERSON_ICONS = __ds_scope.PATTERSON_ICONS;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Stat = __ds_scope.Stat;

__ds_ns.Alert = __ds_scope.Alert;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

})();
