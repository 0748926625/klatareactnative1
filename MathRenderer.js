import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MathRenderer = ({ math, color = 'black', fontSize = 24 }) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <script type="text/javascript" id="MathJax-script" async
          src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js">
        </script>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
            margin: 0;
            padding: 5px;
            background-color: transparent;
          }
          .math {
            font-size: ${fontSize}px;
            color: ${color};
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="math">\\(${math}\\)</div>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

export default MathRenderer;