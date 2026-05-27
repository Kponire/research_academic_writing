import { createTheme, type MantineColorsTuple } from "@mantine/core";

const brand: MantineColorsTuple = [
  "#fff0f3",
  "#ffccd5",
  "#ffb3c1",
  "#ff8fa3",
  "#ff758f",
  "#ff4d6d",
  "#c9184a",
  "#a4133c",
  "#800f2f",
  "#590d22",
];

export const theme = createTheme({
  fontFamily: "'Nunito Sans', sans-serif",
  fontFamilyMonospace: "'JetBrains Mono', monospace",
  headings: {
    fontFamily: "'Nunito Sans', sans-serif",
    fontWeight: "800",
  },
  colors: {
    brand,
  },
  primaryColor: "brand",
  primaryShade: 6,
  defaultRadius: "md",
  components: {
    Button: {
      defaultProps: {
        radius: "md",
      },
      styles: {
        root: {
          fontWeight: 700,
          letterSpacing: "0.01em",
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    TextInput: {
      styles: {
        input: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "13.5px",
          "&:focus": {
            borderColor: "#c9184a",
          },
        },
        label: {
          fontWeight: 700,
          fontSize: "13px",
          marginBottom: "5px",
        },
      },
    },
    Textarea: {
      styles: {
        input: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "13.5px",
        },
        label: {
          fontWeight: 700,
          fontSize: "13px",
          marginBottom: "5px",
        },
      },
    },
    Select: {
      styles: {
        input: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontSize: "13.5px",
        },
        label: {
          fontWeight: 700,
          fontSize: "13px",
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: "lg",
        shadow: "none",
      },
    },
    Modal: {
      styles: {
        title: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 800,
          fontSize: "17px",
          letterSpacing: "-0.02em",
        },
        body: {
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    Tabs: {
      styles: {
        tab: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 700,
          fontSize: "13.5px",
          "&[data-active]": {
            color: "#c9184a",
          },
        },
      },
    },
    Badge: {
      styles: {
        root: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.02em",
        },
      },
    },
    Notification: {
      styles: {
        root: {
          borderRadius: "12px",
          fontFamily: "'Nunito Sans', sans-serif",
        },
        title: {
          fontWeight: 700,
          fontFamily: "'Nunito Sans', sans-serif",
        },
        description: {
          fontFamily: "'Nunito Sans', sans-serif",
        },
      },
    },
    Progress: {
      styles: {
        root: {
          borderRadius: "99px",
        },
        section: {
          borderRadius: "99px",
        },
      },
    },
    Tooltip: {
      styles: {
        tooltip: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 600,
          fontSize: "12px",
          borderRadius: "6px",
        },
      },
    },
    Menu: {
      styles: {
        item: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 600,
          fontSize: "13.5px",
        },
        label: {
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 800,
          fontSize: "10px",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        },
      },
    },
  },
});
