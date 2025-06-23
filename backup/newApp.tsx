import React, { useRef, useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import UserNameScreen from './components/UserNameScreen';
import UserSelectScreen from './components/UserSelectScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StyleSheet, View, Text, Animated, PanResponder, Dimensions, TouchableOpacity, ImageBackground, Image, Easing, FlatList, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Speech from 'expo-speech';
import bgsta from './assets/backgrounds/bgsta.png';
import sky1 from './assets/backgrounds/sky1.png';
import zadiSprite from './assets/sprites/zadi.png';
import splashImage from './assets/splash.jpg';
import fireballImage from './assets/images/fireball.png';
import { Audio } from 'expo-av';
import MathRenderer from './MathRenderer';

// Import des images pour les questions
const questionImages = {
  thales_fig3: require('./assets/images/thales_fig3.png'),
  thales_fig4: require('./assets/images/thales_fig4.png'),
  thales_fig5: require('./assets/images/thales_fig5.png'),
  thales_fig6: require('./assets/images/thales_fig6.png'),
  rectangle_fig1: require('./assets/images/rectangle_fig1.png'),
  rectangle_fig2: require('./assets/images/rectangle_fig2.png'),
  parallelogramme_vecteurs: require('./assets/images/parallelogramme_vecteurs.png'),
  angle_1: require('./assets/images/angle_1.png'),
};

// Votre bibliothèque de questions complète
const questionsLibrary = {
  maths: {
    "CALCUL LITTERAL": [
      {
        question: "\\frac{a}{b} + \\frac{i}{c} =",
        texteOral: "Que vaut la fraction a sur b, plus la fraction i sur c ?",
        correct: "\\frac{ac + bi}{bc}",
        wrongs: ["\\frac{ai + bc}{bc}", "\\frac{ac - bi}{bc}", "\\frac{a + bi}{bc}"]
      },
      {
        question: "\\frac{e}{b} - \\frac{a}{t} =",
        texteOral: "Que vaut la fraction e sur b, moins la fraction a sur t ?",
        correct: "\\frac{et - ba}{bt}",
        wrongs: ["\\frac{eb - at}{bt}", "\\frac{et + ba}{bt}", "\\frac{e - a}{bt}"]
      },
      {
        question: "\\frac{a}{b} \\times \\frac{d}{e} =",
        texteOral: "Que vaut la fraction a sur b, fois la fraction d sur e ?",
        correct: "\\frac{ad}{be}",
        wrongs: ["\\frac{ae}{bd}", "\\frac{a + d}{be}", "\\frac{ad}{b + e}"]
      },
      {
        question: "\\frac{a}{b} + f =",
        texteOral: "Que vaut la fraction a sur b, plus f ?",
        correct: "\\frac{a + bf}{b}",
        wrongs: ["\\frac{a + f}{b}", "\\frac{af + b}{b}", "\\frac{bf - a}{b}"]
      },
      {
        question: "\\frac{\\frac{a}{b}}{\\frac{c}{d}} =",
        texteOral: "Que vaut la fraction a sur b, divisée par la fraction c sur d ?",
        correct: "\\frac{ad}{bc}",
        wrongs: ["\\frac{ac}{bd}", "\\frac{ab}{cd}", "\\frac{cd}{ab}"]
      },
      {
        question: "\\frac{a}{b} = \\frac{c}{d} \\text{ équivaut à}",
        texteOral: "L'égalité a sur b égale c sur d, équivaut à ?",
        correct: "ad = bc",
        wrongs: ["a + b = c + d", "a = \\frac{bc}{d}", "bd = ac"]
      },
      {
        question: "\\frac{1}{a^n} =",
        texteOral: "Que vaut 1 sur a puissance n ?",
        correct: "a^{-n}",
        wrongs: ["a^n", "-a^n", "n^{-a}"]
      },
      {
        question: "a^n \\times b^n =",
        texteOral: "Que vaut a puissance n, fois b puissance n ?",
        correct: "(ab)^n",
        wrongs: ["(a + b)^n", "a^{n+n}b^{n+n}", "a^n + b^n"]
      },
      {
        question: "a^m \\times a^n =",
        texteOral: "Que vaut a puissance m, fois a puissance n ?",
        correct: "a^{m + n}",
        wrongs: ["a^{m - n}", "a^{mn}", "a^{m \\times n}"]
      },
      {
        question: "(a^m)^n =",
        texteOral: "Que vaut, entre parenthèses, a puissance m, le tout à la puissance n ?",
        correct: "a^{m \\times n}",
        wrongs: ["a^{m + n}", "a^{mn}", "(a^{m+n})"]
      },
      {
        question: "\\frac{a^m}{a^n} =",
        texteOral: "Que vaut a puissance m, sur a puissance n ?",
        correct: "a^{m - n}",
        wrongs: ["a^{n - m}", "a^{m + n}", "a^{mn}"]
      },
      {
        question: "a + (b - c) - (d - e) =",
        texteOral: "Que vaut a, plus, entre parenthèses, b moins c, moins, entre parenthèses, d moins e ?",
        correct: "a + b - c - d + e",
        wrongs: ["a + b - c + d - e", "a - b + c - d + e", "a + b + c - d - e"]
      },
      {
        question: "a(x + y - z) =",
        texteOral: "Que vaut a, facteur de, entre parenthèses, x plus y moins z ?",
        correct: "ax + ay - az",
        wrongs: ["ax + yz - az", "ax + ay + az", "a + x + y - z"]
      },
      {
        question: "(a - b)^2 =",
        texteOral: "Que vaut, entre parenthèses, a moins b, le tout au carré ?",
        correct: "a^2 - 2ab + b^2",
        wrongs: ["a^2 + 2ab + b^2", "a^2 - 2a + b^2", "a^2 - b^2"]
      },
      {
        question: "(a + b)(a - b) =",
        texteOral: "Que vaut, entre parenthèses, a plus b, facteur de, entre parenthèses, a moins b ?",
        correct: "a^2 - b^2",
        wrongs: ["a^2 + b^2", "a^2 - 2ab - b^2", "a^2 + ab - b^2"]
      },
      {
        question: "a \\times b = 0 \\text{ équivaut à}",
        texteOral: "a fois b égale zéro, équivaut à ?",
        correct: "a = 0 \\text{ ou } b = 0",
        wrongs: ["a = 0 \\text{ et } b = 0", "a = 1 \\text{ ou } b = 1", "ab = 1"]
      },
      {
        question: "a^2 = b^2 \\text{ équivaut à}",
        texteOral: "a au carré égale b au carré, équivaut à ?",
        correct: "a = b \\text{ ou } a = -b",
        wrongs: ["\\begin{array}{c} \\text{a = b} \\\\ \\text{seulement} \\end{array}", "\\begin{array}{c} \\text{a = -b} \\\\ \\text{seulement} \\end{array}", "\\text{Pas de solution}"]
      },
      {
        question: "22x^5 - 4x^2 + 3 \\text{ est un …}",
        texteOral: "vingt-deux x puissance cinq, moins quatre x au carré, plus trois, est un ... de degré ... ?",
        correct: "\\begin{array}{c} \\text{polynôme en x} \\\\ \\text{de degré 5} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{polynôme en x} \\\\ \\text{de degré 2} \\end{array}", "\\begin{array}{c} \\text{fraction rationnelle} \\\\ \\text{de degré 5} \\end{array}", "\\begin{array}{c} \\text{polynôme en 5} \\\\ \\text{de degré x} \\end{array}"]
      },
      {
        question: "\\frac{2x + 8}{(3x + 2)(x - 5)} \\text{ est …}",
        texteOral: "La fraction deux x plus huit, sur, le produit de, trois x plus deux, par, x moins cinq, est ... ?",
        correct: "\\begin{array}{c} \\text{une fraction} \\\\ \\text{rationnelle} \\end{array}",
        wrongs: ["\\text{un polynôme}", "\\begin{array}{c} \\text{une expression} \\\\ \\text{irrationnelle} \\end{array}", "\\text{une équation}"]
      },
      {
        question: "\\text{Une fraction rationnelle existe si…}",
        texteOral: "Une fraction rationnelle existe si ... et seulement si ...",
        correct: "\\begin{array}{c} \\text{son dénominateur} \\\\ \\text{est non nul} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{son numérateur} \\\\ \\text{est non nul} \\end{array}", "\\begin{array}{c} \\text{numérateur et dénominateur} \\\\ \\text{sont nuls} \\end{array}", "\\begin{array}{c} \\text{le dénominateur} \\\\ \\text{est positif} \\end{array}"]
      }
    ],
    "LA PROPRIETE DE THALES": [
      {
        question: "\\text{On utilise la propriété de Thalès pour…}",
        texteOral: "On utilise la propriété de Thalès pour ...",
        correct: "\\begin{array}{c} \\text{Calculer des distances ou} \\\\ \\text{justifier une égalité de quotients} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Calculer des aires} \\\\ \\text{ou des volumes} \\end{array}", "\\begin{array}{c} \\text{Montrer que des points} \\\\ \\text{sont alignés} \\end{array}", "\\begin{array}{c} \\text{Déterminer les angles} \\\\ \\text{d'un triangle} \\end{array}"]
      },
      {
        question: "\\begin{array}{c} \\text{Dans ce triangle ABC, quelle égalité} \\\\ \\text{de quotients obtient-on ?} \\end{array}",
        texteOral: "Dans un triangle A B C, M appartient au segment A B et N appartient au segment A C, avec la droite M N parallèle à la droite B C. Quelle égalité de quotients obtient-on ?",
        correct: "\\frac{AM}{AB} = \\frac{AN}{AC}",
        wrongs: ["\\frac{AB}{AM} = \\frac{AC}{AN}", "\\frac{AM}{AC} = \\frac{AN}{AB}", "AM \\cdot AB = AN \\cdot AC"],
        imgKey: "thales_fig3"
      },
      {
        question: "\\begin{array}{c} \\text{Si } (BC) // (ED), \\text{ quelle égalité de quotients} \\\\ \\text{exprime la propriété de Thalès ?} \\end{array}",
        texteOral: "Dans la figure ci-contre, on a la droite B C parallèle à la droite E D. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\frac{AB}{AE} = \\frac{AC}{AD}",
        wrongs: ["\\frac{AF}{AB} = \\frac{AD}{AC}", "\\frac{AB}{AC} = \\frac{AF}{AD}", "AB \\cdot AD = AC \\cdot AF"],
        imgKey: "thales_fig4"
      },
      {
        question: "\\begin{array}{c} \\text{Si } (AB) // (CD), \\text{ quelle égalité de quotients} \\\\ \\text{exprime la propriété de Thalès ?} \\end{array}",
        texteOral: "Dans la figure ci-contre, on a la droite A B parallèle à la droite C D. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\frac{OA}{OD} = \\frac{OB}{OC}",
        wrongs: ["\\frac{OD}{OA} = \\frac{OC}{OB}", "\\frac{OA}{OB} = \\frac{OD}{OC}", "OA \\cdot OC = OD \\cdot OB"],
        imgKey: "thales_fig5"
      },
      {
        question: "\\begin{array}{c} \\text{Si } (AB) // (EF), \\text{ quelle égalité de quotients} \\\\ \\text{exprime la propriété de Thalès ?} \\end{array}",
        texteOral: "Dans la figure ci-contre, on a la droite A B parallèle à la droite E F. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\frac{KE}{KB} = \\frac{KF}{KA}",
        wrongs: ["\\frac{KE}{KF} = \\frac{KB}{KA}", "KE \\cdot KA = KB \\cdot KF", "\\frac{KB}{KE} = \\frac{KA}{KF}"],
        imgKey: "thales_fig6"
      },
      {
        question: "\\begin{array}{c} \\text{On utilise la réciproque de Thalès pour} \\\\ \\text{démontrer que deux droites sont...} \\end{array}",
        texteOral: "On utilise la réciproque de la propriété de Thalès pour démontrer que deux droites sont ...",
        correct: "\\text{parallèles}",
        wrongs: ["\\text{sécantes}", "\\text{perpendiculaires}", "\\text{concourantes}"]
      },
      {
        question: "\\text{On utilise la conséquence de la propriété de Thalès pour…}",
        texteOral: "On utilise la conséquence de la propriété de Thalès pour ...",
        correct: "\\begin{array}{c} \\text{Calculer des} \\\\ \\text{distances} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Déterminer le centre} \\\\ \\text{d'un cercle} \\end{array}", "\\begin{array}{c} \\text{Montrer que trois points} \\\\ \\text{sont colinéaires} \\end{array}", "\\begin{array}{c} \\text{Calculer des mesures} \\\\ \\text{d'angles} \\end{array}"]
      },
      {
        question: "\\text{Si } (AB) // (EF), \\text{ la conséquence de Thalès est :}",
        texteOral: " on a la droite A B parallèle à la droite E F. Quelle égalité de quotients exprime la conséquence de la propriété de Thalès ?",
        correct: "\\frac{KE}{KB} = \\frac{KF}{KA} = \\frac{EF}{AB}",
        wrongs: ["\\frac{KB}{KE} = \\frac{KA}{KF} = \\frac{AB}{EF}", "KE \\cdot KA = KB \\cdot KF = EF \\cdot AB", "\\frac{KE}{KF} = \\frac{KB}{KA} = \\frac{AB}{EF}"],
        imgKey: "thales_fig6"
      }
    ],
    "RACINES CARREES": [
        {
          question: "\\sqrt{49} =",
          texteOral: "Que vaut racine carrée de quarante-neuf ?",
          correct: "7",
          wrongs: ["-7", "49", "9"]
        },
        {
          question: "\\sqrt{25} =",
          texteOral: "Que vaut racine carrée de vingt-cinq ?",
          correct: "5",
          wrongs: ["-5", "25", "6"]
        },
        {
          question: "\\sqrt{16} =",
          texteOral: "Que vaut racine carrée de seize ?",
          correct: "4",
          wrongs: ["-4", "8", "2"]
        },
        {
          question: "\\sqrt{64} =",
          texteOral: "Que vaut racine carrée de soixante-quatre ?",
          correct: "8",
          wrongs: ["-8", "16", "6"]
        },
        {
          question: "\\sqrt{100} =",
          texteOral: "Que vaut racine carrée de cent ?",
          correct: "10",
          wrongs: ["-10", "100", "20"]
        },
        {
          question: "\\sqrt{144} =",
          texteOral: "Que vaut racine carrée de cent quarante-quatre ?",
          correct: "12",
          wrongs: ["-12", "144", "14"]
        },
        {
          question: "\\sqrt{9} =",
          texteOral: "Que vaut racine carrée de neuf ?",
          correct: "3",
          wrongs: ["-3", "9", "1"]
        },
        {
          question: "\\sqrt{1} =",
          texteOral: "Que vaut racine carrée de un ?",
          correct: "1",
          wrongs: ["-1", "0", "2"]
        },
        {
          question: "\\sqrt{81} =",
          texteOral: "Que vaut racine carrée de quatre-vingt-un ?",
          correct: "9",
          wrongs: ["-9", "81", "8"]
        },
        {
          question: "\\sqrt{0} =",
          texteOral: "Que vaut racine carrée de zéro ?",
          correct: "0",
          wrongs: ["1", "-0", ""]
        },
        {
          question: "\\sqrt{121} =",
          texteOral: "Que vaut racine carrée de cent vingt-et-un ?",
          correct: "11",
          wrongs: ["-11", "121", "10"]
        },
        {
          question: "\\text{L'expression conjuguée de } \\sqrt{a} \\text{ est…}",
          texteOral: "L'expression conjuguée de racine carrée de a est ...",
          correct: "-\\sqrt{a}",
          wrongs: ["\\sqrt{a}", "a-\\sqrt{a}", "+\\sqrt{a}"]
        },
        {
          question: "\\text{L'expression conjuguée de } \\sqrt{a}+b \\text{ est…}",
          texteOral: "L'expression conjuguée de racine carrée de a, plus b, est ...",
          correct: "b-\\sqrt{a}",
          wrongs: ["\\sqrt{a}-b", "\\sqrt{a}+b", "b+\\sqrt{a}"]
        },
        {
          question: "\\text{L'expression conjuguée de } a + b\\sqrt{c} \\text{ est…}",
          texteOral: "L'expression conjuguée de a, plus b racine carrée de c, est ...",
          correct: "a - b\\sqrt{c}",
          wrongs: ["a + b\\sqrt{c}", "b\\sqrt{c}-a", "-a - b\\sqrt{c}"]
        },
        {
          question: "(\\sqrt{a})^2 =",
          texteOral: "Que vaut, entre parenthèses, racine carrée de a, le tout au carré ?",
          correct: "a",
          wrongs: ["\\sqrt{a}", "2a", "a\\sqrt{a}"]
        },
        {
          question: "\\sqrt{a^2} =",
          texteOral: "Que vaut racine carrée de a au carré ?",
          correct: "|a|",
          wrongs: ["a", "2a", "a^2"]
        },
        {
          question: "\\sqrt{a \\times b} =",
          texteOral: "Que vaut racine carrée de a fois b ?",
          correct: "\\sqrt{a} \\times \\sqrt{b}",
          wrongs: ["a \\times b", "\\sqrt{a}+\\sqrt{b}", "\\sqrt{a+b}"]
        },
        {
          question: "\\sqrt{\\frac{a}{b}} =",
          texteOral: "Que vaut racine carrée de a sur b ?",
          correct: "\\frac{\\sqrt{a}}{\\sqrt{b}}",
          wrongs: ["\\frac{a}{b}", "\\sqrt{a} \\cdot b", "\\frac{a}{\\sqrt{b}}"]
        },
        {
          question: "\\sqrt{a^{2n}} =",
          texteOral: "Que vaut racine carrée de a puissance deux n ?",
          correct: "a^n",
          wrongs: ["2n\\cdot a", "a^{2n}", "n\\cdot a^2"]
        },
        {
          question: "\\sqrt{a^{2n+1}} =",
          texteOral: "Que vaut racine carrée de a puissance deux n plus un ?",
          correct: "a^n\\sqrt{a}",
          wrongs: ["a^{n+1}", "a^{2n}", "\\sqrt{a}\\cdot a^n"]
        },
        {
          question: "(a\\sqrt{b})^2 =",
          texteOral: "Que vaut, entre parenthèses, a racine carrée de b, le tout au carré ?",
          correct: "a^2b",
          wrongs: ["ab^2", "a^2\\sqrt{b}", "2ab"]
        },
        {
          question: "\\text{… permet d'écrire un quotient sans radical au dénominateur.}",
          texteOral: "Quelle opération permet d'écrire un quotient sans radical au dénominateur ?",
          correct: "\\text{La rationalisation}",
          wrongs: ["\\text{La simplification}", "\\text{La factorisation}", "\\text{La conjugaison}"]
        }
    ],
    "TRIANGLE RECTANGLE": [
      {
        question: "\\begin{array}{c} \\text{Pythagore : Dans un triangle ABC} \\\\ \\text{rectangle en B, } AC^2 = ? \\end{array}",
        texteOral: "Selon la propriété de Pythagore, dans le triangle rectangle A B C, rectangle en B, A C au carré égale ?",
        correct: "AB^2 + BC^2",
        wrongs: ["BC^2 - AC^2", "AC^2+BC^2", "AB^2 - BC^2"],
        imgKey: "rectangle_fig1"
      },
      {
        question: "\\begin{array}{c} \\text{Pythagore : Dans un triangle ABC} \\\\ \\text{rectangle en B, } AB^2 = ? \\end{array}",
        texteOral: "Selon la propriété de Pythagore, dans le triangle rectangle A B C, rectangle en B, A B au carré égale ?",
        correct: "AC^2 - BC^2",
        wrongs: ["AC^2 + BC^2", "BC^2 - AC^2", "BC^2 + AC^2"],
        imgKey: "rectangle_fig1"
      },
      {
        question: "\\text{Selon la propriété métrique déduite de l'aire, on a :}",
        texteOral: "Selon la propriété métrique déduite de l'aire, on a ?",
        correct: "EF \\times FG = FT \\times EG",
        wrongs: ["EF + FG = FT + EG", "EF \\times FT = FG \\times EG", "EF \\times EG = FG \\times ET"],
        imgKey: "rectangle_fig2"
      },
      {
        question: "\\text{Si un triangle est rectangle, alors le carré de l'hypoténuse est égal…}",
        texteOral: "Si un triangle est rectangle, alors le carré de l'hypoténuse est égal ...",
        correct: "\\begin{array}{c} \\text{à la somme des carrés} \\\\ \\text{des deux autres côtés} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{à la somme des longueurs} \\\\ \\text{des deux autres côtés} \\end{array}", "\\begin{array}{c} \\text{à la différence des carrés} \\\\ \\text{des deux autres côtés} \\end{array}", "\\begin{array}{c} \\text{au double de la} \\\\ \\text{plus petite longueur} \\end{array}"]
      },
      {
        question: "\\text{On utilise la propriété de Pythagore pour…}",
        texteOral: "On utilise la propriété de Pythagore pour ...",
        correct: "\\begin{array}{c} \\text{calculer la longueur} \\\\ \\text{d'un segment} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{déterminer si un} \\\\ \\text{triangle est isocèle} \\end{array}", "\\begin{array}{c} \\text{calculer la somme} \\\\ \\text{des angles} \\end{array}", "\\begin{array}{c} \\text{trouver le centre} \\\\ \\text{d'un cercle inscrit} \\end{array}"]
      },
      {
        question: "\\text{On utilise la réciproque de Pythagore pour…}",
        texteOral: "On utilise la réciproque de la propriété de Pythagore pour ...",
        correct: "\\begin{array}{c} \\text{démontrer qu'un triangle} \\\\ \\text{est rectangle} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{calculer des} \\\\ \\text{distances} \\end{array}", "\\begin{array}{c} \\text{montrer que deux angles} \\\\ \\text{sont égaux} \\end{array}", "\\begin{array}{c} \\text{prouver que deux droites} \\\\ \\text{sont parallèles} \\end{array}"]
      },
      {
        question: "\\text{Si le carré d'un côté est égal à la somme des carrés des deux autres, alors…}",
        texteOral: "Dans un triangle, si on vérifie que le carré d'un côté est égal à la somme des carrés des deux autres, alors ...",
        correct: "\\begin{array}{c} \\text{le triangle} \\\\ \\text{est rectangle} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{le triangle} \\\\ \\text{est équilatéral} \\end{array}", "\\begin{array}{c} \\text{le triangle} \\\\ \\text{est isocèle} \\end{array}", "\\begin{array}{c} \\text{le triangle} \\\\ \\text{est quelconque} \\end{array}"]
      },
      {
        question: "\\text{Le sinus d'un angle aigu est égal à…}",
        texteOral: "Le sinus d'un angle aigu est égal à ...",
        correct: "\\frac{\\text{côté opposé}}{\\text{hypoténuse}}",
        wrongs: ["\\frac{\\text{côté adjacent}}{\\text{hypoténuse}}", "\\frac{\\text{côté opposé}}{\\text{côté adjacent}}", "\\frac{\\text{hypoténuse}}{\\text{côté opposé}}"]
      },
      {
        question: "\\text{Le cosinus d'un angle aigu est égal à…}",
        texteOral: "Le cosinus d'un angle aigu est égal à ...",
        correct: "\\frac{\\text{côté adjacent}}{\\text{hypoténuse}}",
        wrongs: ["\\frac{\\text{côté opposé}}{\\text{hypoténuse}}", "\\frac{\\text{hypoténuse}}{\\text{côté adjacent}}", "\\frac{\\text{côté adjacent}}{\\text{côté opposé}}"]
      },
      {
        question: "\\text{La tangente d'un angle aigu est égale à…}",
        texteOral: "La tangente d'un angle aigu est égale à ...",
        correct: "\\frac{\\text{côté opposé}}{\\text{côté adjacent}}",
        wrongs: ["\\frac{\\text{côté adjacent}}{\\text{côté opposé}}", "\\frac{\\text{hypoténuse}}{\\text{côté adjacent}}", "\\frac{\\text{côté opposé}}{\\text{hypoténuse}}"]
      },
      {
        question: "\\text{Quelle est la relation trigonométrique fondamentale ?}",
        texteOral: "Quelle est la relation trigonométrique fondamentale ?",
        correct: "\\sin^2(x) + \\cos^2(x) = 1",
        wrongs: ["\\sin(x) + \\cos(x) = 1", "\\tan(x) = \\sin(x) + \\cos(x)", "\\cos(x) = 1 - \\sin(x)"]
      },
      {
        question: "\\text{Les angles aigus d'un triangle rectangle sont…}",
        texteOral: "Les angles aigus d'un triangle rectangle sont ...",
        correct: "\\begin{array}{c} \\text{complémentaires} \\\\ \\text{(somme = 90°)} \\end{array}",
        wrongs: ["\\text{opposés}", "\\text{égaux}", "\\begin{array}{c} \\text{supplémentaires} \\\\ \\text{(somme = 180°)} \\end{array}"]
      }
    ],
    "CALCUL NUMERIQUE": [
      {
        question: "\\begin{array}{c} \\text{L'intersection des ensembles A et B} \\\\ (A \\cap B) \\text{ est :} \\end{array}",
        texteOral: "L'intersection des ensembles A et B, notée A inter B, est :",
        correct: "\\begin{array}{c} \\text{l'ensemble des éléments} \\\\ \\text{appartenant à A et B} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{l'ensemble des éléments} \\\\ \\text{appartenant à A ou B} \\end{array}", "\\text{l'ensemble vide}", "\\begin{array}{c} \\text{l'ensemble des éléments n'appartenant} \\\\ \\text{ni à A ni à B} \\end{array}"]
      },
      {
        question: "\\begin{array}{c} \\text{La réunion des ensembles A et B} \\\\ (A \\cup B) \\text{ est :} \\end{array}",
        texteOral: "La réunion des ensembles A et B, notée A union B, est :",
        correct: "\\begin{array}{c} \\text{l'ensemble des éléments} \\\\ \\text{appartenant à A ou B} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{l'ensemble des éléments} \\\\ \\text{appartenant à A et B} \\end{array}", "\\begin{array}{c} \\text{l'ensemble des éléments n'appartenant} \\\\ \\text{ni à A ni à B} \\end{array}", "\\begin{array}{c} \\text{un sous-ensemble} \\\\ \\text{de A seulement} \\end{array}"]
      },
      {
        question: "\\text{Si } 4 < 7, \\text{ alors leurs inverses vérifient :}",
        texteOral: "Si quatre est inférieur à sept, alors leurs inverses vérifient :",
        correct: "\\frac{1}{4} > \\frac{1}{7}",
        wrongs: ["\\frac{1}{4} < \\frac{1}{7}", "\\frac{1}{4} = \\frac{1}{7}", "\\frac{1}{4} + \\frac{1}{7} = 0"]
      },
      {
        question: "\\begin{array}{c} \\text{Avec } a < E < b \\text{ et } c < F < d, \\\\ \\text{un encadrement de } E + F \\text{ est :} \\end{array}",
        texteOral: "Avec a inférieur à E inférieur à b, et c inférieur à F inférieur à d, un encadrement de E plus F est :",
        correct: "a + c < E + F < b + d",
        wrongs: ["ac < E + F < bd", "a + b < E + F <c + d", "a + d < E + F <b + c"]
      },
      {
        question: "\\text{Si } a < 0 \\text{ et } b < 0, \\text{ alors } a \\times b \\text{ est :}",
        texteOral: "Si a est inférieur à zéro et b est inférieur à zéro, alors a fois b est :",
        correct: "\\text{Positif}",
        wrongs: ["\\text{Négatif}", "\\text{Nul}", "\\begin{array}{c} \\text{Impossible à} \\\\ \\text{déterminer} \\end{array}"]
      },
      {
        question: "\\text{Que vaut } |\\pi - 2| \\text{ ?}",
        texteOral: "Que vaut valeur absolue de pi moins deux ?",
        correct: "\\pi - 2",
        wrongs: ["2 - \\pi", "\\pi + 2", "0"]
      },
      {
        question: "\\text{Que vaut } |\\pi - 7| \\text{ ?}",
        texteOral: "Que vaut valeur absolue de pi moins sept ?",
        correct: "7 - \\pi",
        wrongs: ["\\pi - 7", "\\pi + 7", "0"]
      },
      {
        question: "\\text{L'amplitude de l'intervalle } [f ; j] \\text{ est :}",
        texteOral: "Quel est l'amplitude de l'intervalle fermé f, j ?",
        correct: "j - f",
        wrongs: ["j + f", "0", "j \\times f"]
      },
      {
        question: "\\text{Le centre de l'intervalle } [a ; z] \\text{ est :}",
        texteOral: "Le centre de l'intervalle fermé a, z est :",
        correct: "\\frac{a + z}{2}",
        wrongs: ["\\frac{z - a}{2}", "a", "z"]
      },
      {
        question: "\\text{Comment se lit l'intervalle } [3 ; 17] \\text{ ?}",
        texteOral: "Comment se lit l'intervalle crochet fermé trois, point virgule, dix-sept, crochet fermé ?",
        correct: "\\begin{array}{c} \\text{Intervalle fermé} \\\\ \\text{de 3 à 17} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Intervalle ouvert} \\\\ \\text{de 3 à 17} \\end{array}", "\\begin{array}{c} \\text{Intervalle fermé en 3} \\\\ \\text{et ouvert en 17} \\end{array}", "\\begin{array}{c} \\text{Intervalle ouvert en 3} \\\\ \\text{et fermé en 17} \\end{array}"]
      },
      {
        question: "\\text{Comment se lit l'intervalle } [-5 ; +\\infty[ \\text{ ?}",
        texteOral: "Comment se lit l'intervalle crochet fermé moins cinq, point virgule, plus l'infini, crochet ouvert ?",
        correct: "\\begin{array}{c} \\text{Intervalle des nombres supérieurs} \\\\ \\text{ou égaux à -5} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Intervalle des nombres} \\\\ \\text{supérieurs à -5} \\end{array}", "\\begin{array}{c} \\text{Intervalle des nombres} \\\\ \\text{supérieurs à 5} \\end{array}", "\\begin{array}{c} \\text{Intervalle des nombres inférieurs} \\\\ \\text{ou égaux à -5} \\end{array}"]
      },
      {
        question: "\\text{Comment se lit l'intervalle } ]-1 ; 4] \\text{ ?}",
        texteOral: "Comment se lit l'intervalle crochet ouvert moins un, point virgule, quatre, crochet fermé ?",
        correct: "\\begin{array}{c} \\text{Intervalle ouvert en -1} \\\\ \\text{et fermé en 4} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Intervalle fermé en -1} \\\\ \\text{et ouvert en 4} \\end{array}", "\\begin{array}{c} \\text{Intervalle ouvert} \\\\ \\text{de -1 à 4} \\end{array}", "\\begin{array}{c} \\text{Intervalle fermé} \\\\ \\text{de -1 à 4} \\end{array}"]
      },
      {
        question: "\\text{Comment se lit l'intervalle } ]-\\infty ; 6] \\text{ ?}",
        texteOral: "Comment se lit l'intervalle crochet ouvert moins l'infini, point virgule, six, crochet fermé ?",
        correct: "\\begin{array}{c} \\text{Intervalle des nombres inférieurs} \\\\ \\text{ou égaux à 6} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Intervalle des nombres supérieurs} \\\\ \\text{ou égaux à 6} \\end{array}", "\\begin{array}{c} \\text{Intervalle des nombres} \\\\ \\text{inférieurs à 6} \\end{array}", "\\begin{array}{c} \\text{Intervalle des nombres} \\\\ \\text{supérieurs à 6} \\end{array}"]
      },
      {
        question: "\\text{Comment se lit l'intervalle } [2 ; 14[ \\text{ ?}",
        texteOral: "Comment se lit l'intervalle crochet fermé deux, point virgule, quatorze, crochet ouvert ?",
        correct: "\\begin{array}{c} \\text{Intervalle fermé en 2} \\\\ \\text{et ouvert en 14} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Intervalle fermé} \\\\ \\text{de 2 à 14} \\end{array}", "\\begin{array}{c} \\text{Intervalle ouvert en 2} \\\\ \\text{et fermé en 14} \\end{array}", "\\begin{array}{c} \\text{Intervalle ouvert} \\\\ \\text{de 2 à 14} \\end{array}"]
      }
    ],
    "ANGLES INSCRITS DANS UN CERCLE": [
      {
        question: "\\text{L'angle } \\hat{RST} \\text{ est un ...?}",
        texteOral: "L'angle R S T est un ...?",
        correct: "\\begin{array}{c} \\text{Angle aigu} \\\\ \\text{inscrit} \\end{array}",
        wrongs: ["\\text{Angle droit}", "\\text{Angle au centre}", "\\text{Angle plat}"],
        imgKey: "angle_1"
      },
      {
        question: "\\text{Quelle est la mesure de l'angle } \\hat{RST} \\text{ ?}",
        texteOral: "Quelle est la mesure de l'angle R S T ?",
        correct: "75°",
        wrongs: ["80°", "90°", "150°"],
        imgKey: "angle_1"
      },
      {
        question: "\\text{L'angle } \\hat{SRT} \\text{ est un...?}",
        texteOral: "L'angle S R T est un ...?",
        correct: "\\begin{array}{c} \\text{Angle aigu} \\\\ \\text{inscrit} \\end{array}",
        wrongs: ["\\text{Angle droit}", "\\text{Angle au centre}", "\\text{Angle plat}"],
        imgKey: "angle_1"
      },
      {
        question: "\\text{Quelle est la mesure de l'angle } \\hat{SRT} \\text{ ?}",
        texteOral: "Quelle est la mesure de l'angle S R T ?",
        correct: "40°",
        wrongs: ["75°", "80°", "160°"],
        imgKey: "angle_1"
      },
      {
        question: "\\text{Quelle est la nature de l'angle } \\hat{SOT} \\text{ ?}",
        texteOral: "Quelle est la nature de l'angle S O T ?",
        correct: "\\text{Angle au centre}",
        wrongs: ["\\text{Angle aigu}", "\\text{Angle droit}", "\\text{Angle plat}"],
        imgKey: "angle_1"
      },
      {
        question: "\\text{Quelle est la mesure de l'angle } \\hat{RTU} \\text{ ?}",
        texteOral: "Quelle est la mesure de l'angle R T U ?",
        correct: "65°",
        wrongs: ["60°", "80°", "150°"],
        imgKey: "angle_1"
      }
    ],
    "VECTEURS": [
       {
        question: "\\text{Un vecteur } \\overrightarrow{AB} \\text{ est caractérisé par :}",
        texteOral: "Un vecteur A B est caractérisé par :",
        correct: "\\begin{array}{c} \\text{Sa direction, son sens} \\\\ \\text{et sa norme} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Sa couleur et} \\\\ \\text{sa longueur} \\end{array}", "\\begin{array}{c} \\text{Sa position et} \\\\ \\text{sa vitesse} \\end{array}", "\\begin{array}{c} \\text{Son angle et} \\\\ \\text{sa surface} \\end{array}"],
        imgKey: "vecteur_caracteristiques"
      },
      {
        question: "\\text{Que vaut } \\overrightarrow{AB} + \\overrightarrow{BC} \\text{ ?}",
        texteOral: "Que vaut vecteur A B plus vecteur B C ?",
        correct: "\\overrightarrow{AC}",
        wrongs: ["\\overrightarrow{BA}", "\\overrightarrow{AB}", "\\overrightarrow{0}"],
        imgKey: "relation_chasles"
      },
      {
        question: "\\text{Deux vecteurs } \\overrightarrow{u} \\text{ et } \\overrightarrow{v} \\text{ sont colinéaires si :}",
        texteOral: "Deux vecteurs u et v sont colinéaires si :",
        correct: "\\begin{array}{c} \\text{Il existe un réel k tel que} \\\\ \\text{\\overrightarrow{u} = k \\overrightarrow{v}} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Ils ont la même} \\\\ \\text{longueur} \\end{array}", "\\begin{array}{c} \\text{Ils forment un} \\\\ \\text{angle droit} \\end{array}", "\\begin{array}{c} \\text{Ils partagent} \\\\ \\text{la même origine} \\end{array}"],
        imgKey: "vecteurs_colineaires"
      },
      {
        question: "\\text{Si } \\overrightarrow{AB} = \\overrightarrow{CD}, \\text{ que peut-on dire ?}",
        texteOral: "Si vecteur A B égale vecteur C D, que peut-on dire ?",
        correct: "\\begin{array}{c} \\text{Ils ont même direction,} \\\\ \\text{sens et longueur} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Ils partagent} \\\\ \\text{la même origine} \\end{array}", "\\text{Ils sont opposés}", "\\text{Ils sont nuls}"],
        imgKey: "vecteurs_egaux"
      },
      {
        question: "\\text{Que représente } \\overrightarrow{AB} - \\overrightarrow{AC} \\text{ ?}",
        texteOral: "Que représente vecteur A B moins vecteur A C ?",
        correct: "\\overrightarrow{CB}",
        wrongs: ["\\overrightarrow{BA}", "\\overrightarrow{BC}", "\\overrightarrow{0}"],
        imgKey: "soustraction_vecteurs"
      },
      {
        question: "\\text{Dans un parallélogramme ABCD, que vaut } \\overrightarrow{AB} + \\overrightarrow{AD} \\text{ ?}",
        texteOral: "Dans un parallélogramme A B C D, que vaut vecteur A B plus vecteur A D ?",
        correct: "\\overrightarrow{AC}",
        wrongs: ["\\overrightarrow{BD}", "\\overrightarrow{0}", "\\overrightarrow{AB}"],
        imgKey: "parallelogramme_vecteurs"
      }
    ],
    "COORDONNEES DE VECTEURS": [
      {
        question: "\\begin{array}{c} \\text{Quelles conditions définissent} \\\\ \\text{un repère orthonormé ?} \\end{array}",
        texteOral: "Dans un repère orthonormé, quelles conditions définissent le repère ?",
        correct: "(OI) ⊥ (OJ) et OI = OJ",
        wrongs: ["(OI) // (OJ)", "OI = 2 \\times OJ", "\\begin{array}{c} \\text{Seulement} \\\\ \\text{(OI) ⊥ (OJ)} \\end{array}"],
        imgKey: "repere_orthonorme"
      },
      {
        question: "\\begin{array}{c} \\text{Si } A(x_A, y_A) \\text{ et } B(x_B, y_B), \\\\ \\text{les coordonnées de } \\overrightarrow{AB} \\text{ sont :} \\end{array}",
        texteOral: "Si A a pour coordonnées x un, y un, et B a pour coordonnées x deux, y deux, quel est le couple de coordonnées du vecteur A B ?",
        correct: "(x_B - x_A ; y_B - y_A)",
        wrongs: ["(x_A + x_B ; y_A + y_B)", "(x_A - x_B ; y_A - y_B)", "(\\frac{x_A+x_B}{2} ; \\frac{y_A+y_B}{2})"],
        imgKey: "coordonnees_vecteur"
      },
      {
        question: "\\begin{array}{c} \\text{Deux vecteurs } \\overrightarrow{u}(x;y) \\text{ et } \\overrightarrow{v}(x';y') \\\\ \\text{sont colinéaires si :} \\end{array}",
        texteOral: "Deux vecteurs u de coordonnées x, y, et v de coordonnées x prime, y prime, sont colinéaires si :",
        correct: "xy' - x'y = 0",
        wrongs: ["xx' + yy' = 0", "x + x' = y + y'", "\\frac{x}{x'} = \\frac{y}{y'}"],
        imgKey: "colinearite"
      },
      {
        question: "\\text{La formule des coordonnées du milieu M de } [AB] \\text{ est :}",
        texteOral: "Quelle formule donne les coordonnées du milieu M du segment A B ?",
        correct: "M(\\frac{x_A + x_B}{2} ; \\frac{y_A + y_B}{2})",
        wrongs: ["M(x_A - x_B ; y_A - y_B)", "M(x_B - x_A ; y_B - y_A)", "M(\\frac{x_A}{2} ; \\frac{y_B}{2})"],
        imgKey: "milieu_segment"
      },
      {
        question: "\\begin{array}{c} \\text{Comment calcule-t-on la distance AB} \\\\ \\text{dans un repère orthonormé ?} \\end{array}",
        texteOral: "Comment calcule-t-on la distance A B dans un repère orthonormé ?",
        correct: "AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}",
        wrongs: ["AB = |x_B - x_A| + |y_B - y_A|", "AB = \\frac{(x_B - x_A) + (y_B - y_A)}{2}", "AB = (x_B - x_A) \\times (y_B - y_A)"],
        imgKey: "distance_points"
      },
      {
        question: "\\begin{array}{c} \\text{Deux vecteurs } \\overrightarrow{u}(a;b) \\text{ et } \\overrightarrow{v}(c;d) \\\\ \\text{sont orthogonaux si :} \\end{array}",
        texteOral: "Deux vecteurs u de coordonnées a, b, et v de coordonnées c, d, sont orthogonaux si :",
        correct: "ac + bd = 0",
        wrongs: ["ad - bc = 0", "\\frac{a}{c} = \\frac{b}{d}", "a + c = b + d"],
        imgKey: "orthogonalite"
      },
      {
        question: "\\text{Que vaut } k \\times \\overrightarrow{AB}(x;y) \\text{ ?}",
        texteOral: "Que vaut k fois le vecteur A B de coordonnées x, y ?",
        correct: "\\overrightarrow{AB}(kx ; ky)",
        wrongs: ["\\overrightarrow{AB}(x + k ; y + k)", "\\overrightarrow{AB}(\\frac{x}{k} ; \\frac{y}{k})", "\\overrightarrow{AB}(x^k ; y^k)"],
        imgKey: "produit_scalaire_vecteur"
      }
    ],
    "EQUATIONS ET INEQUATIONS": [
      {
        question: "\\text{Quelle est la solution de l'équation } ax + b = 0 \\text{ ?}",
        texteOral: "Quelle est la solution de l'équation a x plus b égale zéro ?",
        correct: "x = -\\frac{b}{a}",
        wrongs: ["x = \\frac{b}{a}", "x = \\frac{a}{b}", "x = 0"],
        imgKey: "equation_ax_plus_b"
      },
      {
        question: "\\text{Comment résoudre } ax + b = cx + d \\text{ ?}",
        texteOral: "Comment résoudre a x plus b, égale c x plus d ?",
        correct: "\\begin{array}{c} \\text{Isoler x en regroupant} \\\\ \\text{les termes} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Additionner} \\\\ \\text{a et c} \\end{array}", "\\begin{array}{c} \\text{Diviser par x} \\\\ \\text{des deux côtés} \\end{array}", "\\begin{array}{c} \\text{Remplacer x} \\\\ \\text{par 0} \\end{array}"],
        imgKey: "equation_ax_egal_cx"
      },
      {
        question: "\\text{Que signifie } (ax + b)(cx + d) = 0 \\text{ ?}",
        texteOral: "Que signifie, entre parenthèses, a x plus b, facteur de, entre parenthèses, c x plus d, égale zéro ?",
        correct: "\\begin{array}{c} \\text{Au moins un des} \\\\ \\text{facteurs est nul} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Les deux facteurs} \\\\ \\text{sont positifs} \\end{array}", "\\begin{array}{c} \\text{Les deux facteurs} \\\\ \\text{sont égaux} \\end{array}", "\\begin{array}{c} \\text{Le produit est} \\\\ \\text{toujours positif} \\end{array}"],
        imgKey: "produit_egal_zero"
      },
      {
        question: "\\begin{array}{c} \\text{Que fait-on si on divise une inéquation} \\\\ \\text{par un nombre négatif ?} \\end{array}",
        texteOral: "Que fait-on si on divise par un nombre négatif dans une inéquation ?",
        correct: "\\begin{array}{c} \\text{On inverse le sens} \\\\ \\text{de l'inégalité} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{On garde le} \\\\ \\text{même sens} \\end{array}", "\\begin{array}{c} \\text{On transforme} \\\\ \\text{en équation} \\end{array}", "\\begin{array}{c} \\text{On ajoute 1 aux} \\\\ \\text{deux membres} \\end{array}"],
        imgKey: "inegalite_negatif"
      },
      {
        question: "\\text{Comment écrire } x \\geq 5 \\text{ en intervalle ?}",
        texteOral: "Comment écrire x supérieur ou égal à cinq en intervalle ?",
        correct: "[5 ; +\\infty[",
        wrongs: ["]5 ; +\\infty[", "]-\\infty ; 5]", "[5 ; 10]"],
        imgKey: "intervalle_superieur"
      },
      {
        question: "\\text{La solution d'un système de deux inéquations est...}",
        texteOral: "Que représente la solution d'un système de deux inéquations ?",
        correct: "\\begin{array}{c} \\text{L'intersection des deux} \\\\ \\text{ensembles de solutions} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{La réunion des} \\\\ \\text{deux ensembles} \\end{array}", "\\begin{array}{c} \\text{La moyenne des} \\\\ \\text{solutions} \\end{array}", "\\begin{array}{c} \\text{Aucune solution} \\\\ \\text{possible} \\end{array}"],
        imgKey: "systeme_inequations"
      },
      {
        question: "\\begin{array}{c} \\text{Pour } T_1 = 10000 + 70x \\text{ et } T_2 = 7000 + 90x, \\\\ \\text{quand les tarifs sont-ils égaux ?} \\end{array}",
        texteOral: "Si une entreprise propose un tarif T égale dix mille plus soixante-dix x, et une autre T égale sept mille plus quatre-vingt-dix x, comment trouver le kilométrage où les tarifs sont égaux ?",
        correct: "\\text{On résout 10000 + 70x = 7000 + 90x}",
        wrongs: ["\\begin{array}{c} \\text{On additionne les} \\\\ \\text{deux équations} \\end{array}", "\\begin{array}{c} \\text{On cherche x tel que} \\\\ \\text{70x > 90x} \\end{array}", "\\begin{array}{c} \\text{On ignore les} \\\\ \\text{constantes} \\end{array}"],
        imgKey: "application_tarifs"
      }
    ],
    "EQUATIONS DE DROITES": [
      {
        question: "\\text{Quelle est l'équation cartésienne d'une droite ?}",
        texteOral: "Quelle est la forme générale d'une équation de droite dans un repère ?",
        correct: "ax + by + c = 0",
        wrongs: ["y = ax^2 + b", "xy = k", "ax + b = 0"],
        imgKey: "forme_generale"
      },
      {
        question: "\\text{Que représente le coefficient directeur d'une droite ?}",
        texteOral: "Que permet de vérifier le coefficient directeur d'une droite ?",
        correct: "\\begin{array}{c} \\text{Son inclinaison} \\\\ \\text{(sa pente)} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Sa distance} \\\\ \\text{à l'origine} \\end{array}", "\\begin{array}{c} \\text{Son intersection} \\\\ \\text{avec l'axe y} \\end{array}", "\\begin{array}{c} \\text{Sa couleur sur} \\\\ \\text{un graphique} \\end{array}"],
        imgKey: "role_coefficient"
      },
      {
        question: "\\begin{array}{c} \\text{Quelle est l'équation d'une droite} \\\\ \\text{parallèle à l'axe des ordonnées ?} \\end{array}",
        texteOral: "Quelle est la propriété des droites parallèles à l'axe des ordonnées ?",
        correct: "x = k",
        wrongs: ["y = k", "y = ax+b", "y=x"],
        imgKey: "droite_verticale"
      },
      {
        question: "\\text{Que signifie 'b' dans } y = ax + b \\text{ ?}",
        texteOral: "Que signifie l'ordonnée à l'origine b, dans y égale a x plus b ?",
        correct: "\\text{L'ordonnée à l'origine}",
        wrongs: ["\\begin{array}{c} \\text{La pente de} \\\\ \\text{la droite} \\end{array}", "\\begin{array}{c} \\text{L'abscisse} \\\\ \\text{à l'origine} \\end{array}", "\\begin{array}{c} \\text{La longueur de} \\\\ \\text{la droite} \\end{array}"],
        imgKey: "ordonnee_origine"
      },
      {
        question: "\\text{Deux droites sont perpendiculaires si...}",
        texteOral: "Comment justifier que deux droites sont perpendiculaires ?",
        correct: "\\begin{array}{c} \\text{le produit de leurs coefficients} \\\\ \\text{directeurs vaut -1} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{leurs coefficients directeurs} \\\\ \\text{sont égaux} \\end{array}", "\\begin{array}{c} \\text{leurs ordonnées à l'origine} \\\\ \\text{sont opposées} \\end{array}", "\\begin{array}{c} \\text{elles se croisent} \\\\ \\text{à l'origine} \\end{array}"],
        imgKey: "perpendiculaires"
      },
      {
        question: "\\text{Quelle est la particularité de la droite } y = 5 \\text{ ?}",
        texteOral: "Quelle est la particularité d'une droite d'équation y égale cinq ?",
        correct: "\\begin{array}{c} \\text{Elle est parallèle à} \\\\ \\text{l'axe des abscisses} \\end{array}",
        wrongs: ["\\text{Elle est verticale}", "\\begin{array}{c} \\text{Elle passe par} \\\\ \\text{le point (5 ; 0)} \\end{array}", "\\begin{array}{c} \\text{Son coefficient} \\\\ \\text{directeur est 5} \\end{array}"],
        imgKey: "droite_horizontale"
      },
      {
        question: "\\begin{array}{c} \\text{Comment déterminer l'équation d'une droite} \\\\ \\text{passant par deux points ?} \\end{array}",
        texteOral: "Quelle méthode utilise-t-on pour déterminer une équation de droite passant par deux points ?",
        correct: "\\begin{array}{c} \\text{Vérifier la colinéarité} \\\\ \\text{des vecteurs} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Calculer la moyenne} \\\\ \\text{des coordonnées} \\end{array}", "\\begin{array}{c} \\text{Utiliser le théorème} \\\\ \\text{de Pythagore} \\end{array}", "\\begin{array}{c} \\text{Résoudre un système} \\\\ \\text{trigonométrique} \\end{array}"],
        imgKey: "methode_colinearite"
      }
    ],
    "SYSTEMES DANS R x R": [
      {
        question: "\\begin{array}{c} \\text{Une inéquation du 1er degré dans } R \\times R \\\\ \\text{définit...} \\end{array}",
        texteOral: "Quelle est la particularité d'une inéquation du premier degré dans R croix R ?",
        correct: "\\text{un demi-plan}",
        wrongs: ["\\text{une droite}", "\\begin{array}{c} \\text{une seule} \\\\ \\text{solution} \\end{array}", "\\text{un cercle}"],
        imgKey: "inequation_demiplan"
      },
      {
        question: "\\begin{array}{c} \\text{La résolution graphique d'un système} \\\\ \\text{d'équations donne...} \\end{array}",
        texteOral: "Que permet de déterminer la résolution graphique d'un système d'équations ?",
        correct: "\\begin{array}{c} \\text{le point d'intersection} \\\\ \\text{des droites} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{la pente des} \\\\ \\text{droites} \\end{array}", "\\begin{array}{c} \\text{l'aire entre} \\\\ \\text{les courbes} \\end{array}", "\\begin{array}{c} \\text{la distance entre} \\\\ \\text{les droites} \\end{array}"],
        imgKey: "resolution_graphique"
      },
      {
        question: "\\text{Un système de deux équations n'a pas de solution si...}",
        texteOral: "Quelle est la condition pour qu'un système de deux équations n'ait pas de solution ?",
        correct: "\\begin{array}{c} \\text{les droites sont parallèles} \\\\ \\text{et distinctes} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{les droites se coupent} \\\\ \\text{à l'origine} \\end{array}", "\\begin{array}{c} \\text{les coefficients directeurs} \\\\ \\text{sont opposés} \\end{array}", "\\begin{array}{c} \\text{les ordonnées à l'origine} \\\\ \\text{sont égales} \\end{array}"],
        imgKey: "systeme_sans_solution"
      },
      {
        question: "\\text{L'intersection de deux demi-plans est...}",
        texteOral: "Que représente l'intersection de deux demi-plans pour un système d'inéquations ?",
        correct: "\\begin{array}{c} \\text{l'ensemble des solutions communes} \\\\ \\text{aux deux inéquations} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{la réunion des} \\\\ \\text{solutions} \\end{array}", "\\begin{array}{c} \\text{la zone exclue par} \\\\ \\text{les deux inéquations} \\end{array}", "\\begin{array}{c} \\text{le point de rencontre} \\\\ \\text{des axes} \\end{array}"],
        imgKey: "intersection_demiplans"
      },
      {
        question: "\\text{Résoudre un système par combinaison, c'est...}",
        texteOral: "Quelle méthode utilise-t-on pour résoudre un système par combinaison ?",
        correct: "\\begin{array}{c} \\text{éliminer une variable en} \\\\ \\text{additionnant les équations} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{isoler une variable} \\\\ \\text{dans une équation} \\end{array}", "\\begin{array}{c} \\text{tracer les droites} \\\\ \\text{associées} \\end{array}", "\\begin{array}{c} \\text{utiliser des coefficients} \\\\ \\text{négatifs} \\end{array}"],
        imgKey: "methode_combinaison"
      },
      {
        question: "\\begin{array}{c} \\text{Comment vérifier qu'un couple } (x;y) \\\\ \\text{est solution d'une inéquation ?} \\end{array}",
        texteOral: "Comment vérifier qu'un couple x, y, est solution d'une inéquation ?",
        correct: "\\begin{array}{c} \\text{Remplacer x et y dans l'inéquation} \\\\ \\text{et vérifier l'inégalité} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Calculer la distance} \\\\ \\text{à l'origine} \\end{array}", "\\begin{array}{c} \\text{Tracer la droite} \\\\ \\text{correspondante} \\end{array}", "\\begin{array}{c} \\text{Comparer les coefficients} \\\\ \\text{directeurs} \\end{array}"],
        imgKey: "verification_solution"
      },
      {
        question: "\\text{Que signifie le signe '<' dans } 2x + y - 6 < 0 \\text{ ?}",
        texteOral: "Que signifie le signe inférieur strict dans l'inéquation deux x plus y moins six, inférieur strict à zéro ?",
        correct: "\\begin{array}{c} \\text{Les solutions sont le demi-plan} \\\\ \\text{ouvert (droite exclue)} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Les solutions sont} \\\\ \\text{sur la droite} \\end{array}", "\\begin{array}{c} \\text{Les solutions} \\\\ \\text{incluent la droite} \\end{array}", "\\begin{array}{c} \\text{L'inéquation n'a} \\\\ \\text{pas de solution} \\end{array}"],
        imgKey: "signe_inegalite"
      }
    ],
    "STATISTIQUES": [
      {
        question: "\\begin{array}{c} \\text{Comment détermine-t-on la médiane} \\\\ \\text{si l'effectif total est impair ?} \\end{array}",
        texteOral: "Comment détermine-t-on la médiane si l'effectif total est impair ?",
        correct: "\\begin{array}{c} \\text{C'est la valeur centrale} \\\\ \\text{de la série ordonnée} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{On prend la moyenne des} \\\\ \\text{deux valeurs centrales} \\end{array}", "\\begin{array}{c} \\text{C'est toujours la première} \\\\ \\text{valeur de la série} \\end{array}", "\\begin{array}{c} \\text{On utilise la formule} \\\\ \\text{\\( \\frac{n}{2} \\)} \\end{array}"]
      },
      {
        question: "\\begin{array}{c} \\text{Quelle méthode utilise-t-on pour la médiane} \\\\ \\text{si l'effectif total est pair ?} \\end{array}",
        texteOral: "Quelle méthode utilise-t-on pour la médiane si l'effectif total est pair ?",
        correct: "\\begin{array}{c} \\text{La moyenne des deux valeurs} \\\\ \\text{centrales de la série ordonnée} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{On choisit la valeur} \\\\ \\text{la plus fréquente} \\end{array}", "\\begin{array}{c} \\text{On prend la dernière valeur} \\\\ \\text{de la série} \\end{array}", "\\begin{array}{c} \\text{On ignore les deux} \\\\ \\text{valeurs centrales} \\end{array}"]
      },
      {
        question: "\\text{Quelle est la formule correcte de la moyenne d'une série statistique ?}",
        texteOral: "Quelle est la formule correcte de la moyenne d'une série statistique ?",
        correct: "\\frac{\\sum (\\text{valeur} \\times \\text{effectif})}{\\text{effectif total}}",
        wrongs: ["\\frac{\\text{valeur max} + \\text{valeur min}}{2}", "\\sum \\text{effectifs} \\div \\text{nb modalités}", "\\text{effectif total} \\times \\text{valeur centrale}"]
      },
      {
        question: "\\text{Comment calcule-t-on la fréquence d'une modalité ?}",
        texteOral: "Comment calcule-t-on la fréquence d'une modalité ?",
        correct: "\\frac{\\text{effectif de la modalité}}{\\text{effectif total}} \\times 100",
        wrongs: ["\\text{effectif total} \\div \\text{effectif de la modalité}", "\\sum (\\text{valeurs}) \\div \\text{nombre de modalités}", "\\text{effectif cumulé} \\times 100"]
      },
      {
        question: "\\begin{array}{c} \\text{Que représente le polygone des effectifs} \\\\ \\text{cumulés croissants pour trouver la médiane ?} \\end{array}",
        texteOral: "Que représente le polygone des effectifs cumulés croissants pour trouver la médiane ?",
        correct: "\\begin{array}{c} \\text{Le point où la courbe atteint} \\\\ \\text{50% de l'effectif total} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{L'intersection avec} \\\\ \\text{l'axe des ordonnées} \\end{array}", "\\begin{array}{c} \\text{La valeur la plus élevée} \\\\ \\text{de la série} \\end{array}", "\\begin{array}{c} \\text{La classe} \\\\ \\text{modale} \\end{array}"]
      },
      {
        question: "\\text{Quelle affirmation est vraie pour une série avec effectif total pair ?}",
        texteOral: "Quelle affirmation est vraie pour une série avec effectif total pair ?",
        correct: "\\begin{array}{c} \\text{La médiane n'est pas} \\\\ \\text{forcément une valeur de la série} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{La médiane est toujours} \\\\ \\text{un nombre entier} \\end{array}", "\\begin{array}{c} \\text{La médiane correspond} \\\\ \\text{au mode} \\end{array}", "\\begin{array}{c} \\text{La médiane est la moyenne} \\\\ \\text{de toutes les valeurs} \\end{array}"]
      },
      {
        question: "\\text{À quoi correspond la fréquence cumulée croissante ?}",
        texteOral: "À quoi correspond la fréquence cumulée croissante ?",
        correct: "\\begin{array}{c} \\text{Au pourcentage d'individus ayant} \\\\ \\text{une valeur inférieure ou égale} \\\\ \\text{à une modalité} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{À la différence entre} \\\\ \\text{deux effectifs consécutifs} \\end{array}", "\\begin{array}{c} \\text{À la moyenne des} \\\\ \\text{fréquences} \\end{array}", "\\begin{array}{c} \\text{Au nombre total} \\\\ \\text{de modalités} \\end{array}"]
      },
      {
        question: "\\text{Qu'est-ce que le mode d'une série statistique ?}",
        texteOral: "Qu'est-ce que le mode d'une série statistique ?",
        correct: "\\begin{array}{c} \\text{La modalité avec l'effectif} \\\\ \\text{le plus élevé} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{la moyenne des} \\\\ \\text{valeurs extrêmes} \\end{array}", "\\begin{array}{c} \\text{la différence entre la plus} \\\\ \\text{grande et la plus petite valeur} \\end{array}", "\\begin{array}{c} \\text{la valeur centrale} \\\\ \\text{après classement} \\end{array}"]
      },
      {
        question: "\\text{Que représente la médiane d'une série statistique ?}",
        texteOral: "Que représente la médiane d'une série statistique ?",
        correct: "\\begin{array}{c} \\text{La valeur qui sépare la série} \\\\ \\text{en deux groupes de même effectif} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{la valeur la} \\\\ \\text{plus fréquente} \\end{array}", "\\begin{array}{c} \\text{la moyenne} \\\\ \\text{des valeurs} \\end{array}", "\\begin{array}{c} \\text{l'étendue} \\\\ \\text{des données} \\end{array}"]
      }
    ],
    "APPLICATIONS AFFINES": [
      {
        question: "\\text{Quelle est la forme générale d'une application affine ?}",
        texteOral: "Quelle est la forme générale d'une application affine ?",
        correct: "f(x) = ax + b",
        wrongs: ["f(x) = ax^2 + bx + c", "f(x) = a/x + b", "f(x) = |ax| + b"]
      },
      {
        question: "\\begin{array}{c} \\text{Comment reconnaît-on une application linéaire} \\\\ \\text{parmi les applications affines ?} \\end{array}",
        texteOral: "Comment reconnaît-on une application linéaire parmi les applications affines ?",
        correct: "\\begin{array}{c} \\text{Lorsque le terme constant b} \\\\ \\text{est nul (f(x) = ax)} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Lorsque le coefficient a} \\\\ \\text{est négatif} \\end{array}", "\\begin{array}{c} \\text{Lorsque la représentation graphique} \\\\ \\text{est une parabole} \\end{array}", "\\text{Lorsque a = 1}"]
      },
      {
        question: "\\text{Que représente le coefficient 'a' dans } f(x) = ax + b \\text{ ?}",
        texteOral: "Que représente le coefficient a dans f de x égale a x plus b ?",
        correct: "\\begin{array}{c} \\text{La pente de la droite représentant} \\\\ \\text{l'application affine} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{L'ordonnée à l'origine} \\\\ \\text{de la droite} \\end{array}", "\\begin{array}{c} \\text{La valeur maximale} \\\\ \\text{de f(x)} \\end{array}", "\\begin{array}{c} \\text{La distance entre deux points} \\\\ \\text{de la droite} \\end{array}"]
      },
      {
        question: "\\text{Quelle est la particularité de la représentation graphique d'une application linéaire ?}",
        texteOral: "Quelle est la particularité de la représentation graphique d'une application linéaire ?",
        correct: "\\begin{array}{c} \\text{Elle passe toujours par} \\\\ \\text{l'origine du repère} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Elle est toujours parallèle à} \\\\ \\text{l'axe des abscisses} \\end{array}", "\\begin{array}{c} \\text{Elle forme une courbe} \\\\ \\text{exponentielle} \\end{array}", "\\begin{array}{c} \\text{Elle n'a pas d'ordonnée} \\\\ \\text{à l'origine} \\end{array}"]
      },
      {
        question: "\\text{Comment détermine-t-on le sens de variation d'une application affine ?}",
        texteOral: "Comment détermine-t-on le sens de variation d'une application affine ?",
        correct: "\\begin{array}{c} \\text{En analysant le signe} \\\\ \\text{du coefficient a} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{En calculant la} \\\\ \\text{valeur de b} \\end{array}", "\\begin{array}{c} \\text{En traçant obligatoirement} \\\\ \\text{la droite} \\end{array}", "\\begin{array}{c} \\text{En comparant} \\\\ \\text{f(0) et f(1)} \\end{array}"]
      },
      {
        question: "\\text{Que devient une application affine si } a = 0 \\text{ ?}",
        texteOral: "Que devient une application affine si a égale zéro ?",
        correct: "\\begin{array}{c} \\text{Elle est constante} \\\\ \\text{(f(x) = b pour tout x)} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Elle est strictement} \\\\ \\text{croissante} \\end{array}", "\\begin{array}{c} \\text{elle n'est plus} \\\\ \\text{définie} \\end{array}", "\\begin{array}{c} \\text{elle devient} \\\\ \\text{linéaire} \\end{array}"]
      },
      {
        question: "\\begin{array}{c} \\text{Quelle propriété permet de relier une application} \\\\ \\text{linéaire à un tableau de proportionnalité ?} \\end{array}",
        texteOral: "Quelle propriété permet de relier une application linéaire à un tableau de proportionnalité ?",
        correct: "f(kx) = kf(x) et f(x + y) = f(x) + f(y)",
        wrongs: ["f(xy) = f(x)f(y)", "f(1/x) = 1/f(x)", "\\begin{array}{c} \\text{f(x) est toujours} \\\\ \\text{supérieure à x} \\end{array}"]
      }
    ],
    "PYRAMIDES ET CONES": [
      {
        question: "\\text{Quelle caractéristique définit une pyramide régulière ?}",
        texteOral: "Quelle caractéristique définit une pyramide régulière ?",
        correct: "\\begin{array}{c} \\text{Base polygonale régulière +} \\\\ \\text{faces latérales triangulaires} \\\\ \\text{isocèles identiques} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Base circulaire +} \\\\ \\text{faces rectangulaires} \\end{array}", "\\begin{array}{c} \\text{Base quelconque +} \\\\ \\text{faces triangulaires} \\end{array}", "\\begin{array}{c} \\text{Base carrée} \\\\ \\text{uniquement} \\end{array}"]
      },
      {
        question: "\\text{Que représente [SH] dans une pyramide régulière ?}",
        texteOral: "Que représente le segment S H dans une pyramide régulière ?",
        correct: "\\begin{array}{c} \\text{La hauteur (perpendiculaire} \\\\ \\text{à la base passant par le centre)} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Une arête} \\\\ \\text{latérale} \\end{array}", "\\begin{array}{c} \\text{L'apothème} \\\\ \\text{de la base} \\end{array}", "\\begin{array}{c} \\text{La médiane} \\\\ \\text{d'une face} \\end{array}"]
      },
      {
        question: "\\text{Quelle formule donne l'aire latérale d'une pyramide régulière ?}",
        texteOral: "Quelle formule donne l'aire latérale d'une pyramide régulière ?",
        correct: "A_{\\text{lat}} = \\frac{P \\times a}{2} \\text{ (P=périmètre, a=apothème)}",
        wrongs: ["A_{\\text{lat}} = B \\times h", "A_{\\text{lat}} = \\pi r a", "A_{\\text{lat}} = \\frac{h}{3} \\times P"]
      },
      {
        question: "\\begin{array}{c} \\text{Qu'obtient-on en sectionnant une pyramide} \\\\ \\text{par un plan parallèle à sa base ?} \\end{array}",
        texteOral: "Qu'obtient-on en sectionnant une pyramide par un plan parallèle à sa base ?",
        correct: "\\begin{array}{c} \\text{Une réduction homothétique} \\\\ \\text{de la base} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{Un agrandissement} \\\\ \\text{de la base} \\end{array}", "\\begin{array}{c} \\text{Un cercle} \\\\ \\text{concentrique} \\end{array}", "\\begin{array}{c} \\text{Un triangle} \\\\ \\text{rectangle} \\end{array}"]
      },
      {
        question: "\\text{Comment est généré un cône de révolution ?}",
        texteOral: "Comment est généré un cône de révolution ?",
        correct: "\\begin{array}{c} \\text{Rotation d'un triangle rectangle} \\\\ \\text{autour d'un côté de l'angle droit} \\end{array}",
        wrongs: ["\\begin{array}{c} \\text{par la rotation} \\\\ \\text{d'un rectangle} \\end{array}", "\\begin{array}{c} \\text{par la translation} \\\\ \\text{d'un disque} \\end{array}", "\\begin{array}{c} \\text{par la déformation} \\\\ \\text{d'une pyramide} \\end{array}"]
      },
      {
        question: "\\text{La formule du volume d'une pyramide est :}",
        texteOral: "Quelle est l'expression du volume V d'une pyramide régulière ?",
        correct: "V = \\frac{\\text{Aire base} \\times \\text{hauteur}}{3}",
        wrongs: ["V = \\text{Aire base} \\times \\text{hauteur}", "V = \\frac{P \\times a}{2}", "V = \\frac{h}{3} + B"]
      },
      {
        question: "\\text{La formule du volume d'un cône est :}",
        texteOral: "Quelle formule permet de calculer le volume d'un cône de révolution ?",
        correct: "V = \\frac{1}{3} \\pi r^2 h",
        wrongs: ["V = \\pi r^2 h", "V = \\frac{4}{3} \\pi r^3", "V = 2\\pi r (r + h)"]
      }
    ]
  }
};

const PLAYER_RADIUS = 30;
const RECT_WIDTH = 210;
const RECT_HEIGHT = 65;
const JUMP_DURATION = 350;
const GROUND_HEIGHT = 40;
const FRAME_WIDTH = 64;
const FRAME_HEIGHT = 64;
const TOTAL_SPRITE_FRAMES = 13;
const IDLE_FRAME_INDEX = 0;
const RUN_RIGHT_START_INDEX = 1;
const RUN_RIGHT_FRAME_COUNT = 6;
const RUN_LEFT_START_INDEX = 7;
const RUN_LEFT_FRAME_COUNT = 6;
const ANIMATION_SPEED = 80;
const BLOCK_SPEED = 40;

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const formatQuestionWithLineBreaks = (questionText) => {
  if (questionText.length <= 45) {
    return questionText;
  }
  
  // Diviser en segments de 45 caractères
  const segments = [];
  for (let i = 0; i < questionText.length; i += 45) {
    segments.push(questionText.slice(i, i + 45));
  }
  
  // Formater avec LaTeX array
  if (segments.length === 2) {
    return `\\begin{array}{c} ${segments[0]} \\\\ ${segments[1]} \\end{array}`;
  } else if (segments.length === 3) {
    return `\\begin{array}{c} ${segments[0]} \\\\ ${segments[1]} \\\\ ${segments[2]} \\end{array}`;
  } else {
    // Pour plus de 3 segments, on garde les 3 premiers
    return `\\begin{array}{c} ${segments[0]} \\\\ ${segments[1]} \\\\ ${segments[2]}... \\end{array}`;
  }
};

const getFontSizeForQuestion = (questionText = '') => {
  const length = questionText.length;
  if (length > 100) {
    return 20;
  }
  if (length > 60) {
    return 24;
  }
  return 32;
};

const getFontSizeForAnswer = (answerText = '') => {
  const length = answerText.length;
  if (length > 80) {
    return 12;
  }
  if (length > 50) {
    return 14;
  }
  if (length > 30) {
    return 16;
  }
  if (length > 15) {
    return 18;
  }
  return 20;
};

// --- COMPOSANT D'AFFICHAGE MATHÉMATIQUE OPTIMISÉ ---
const MathDisplay = ({ math, color, fontSize = 16 }) => {
  try {
    return (
      <MathRenderer 
        math={math} 
        color={color} 
        fontSize={fontSize}
      />
    );
  } catch (error) {
    return <Text style={{fontSize, color}}>{math}</Text>;
  }
};

export default function App() {
  const [screen, setScreen] = useState(Dimensions.get('window'));
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [showSplash, setShowSplash] = useState(true);
  const chapterNames = Object.keys(questionsLibrary.maths || {});

  const [groundY, setGroundY] = useState(screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2);
  const [playerX, setPlayerX] = useState(screen.width / 2 - PLAYER_RADIUS);
  const playerY = useRef(new Animated.Value(screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2)).current;
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answerBlocks, setAnswerBlocks] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const [moveDirection, setMoveDirection] = useState(null);
  const [skyOffset, setSkyOffset] = useState(0);
  const [frameIndex, setFrameIndex] = useState(IDLE_FRAME_INDEX);
  const [lives, setLives] = useState(7);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isChapterComplete, setIsChapterComplete] = useState(false);
  const [showBilan, setShowBilan] = useState(false);
  const [currentBilanIndex, setCurrentBilanIndex] = useState(0);
  
  const prevDirection = useRef('idle');
  const animationIntervalRef = useRef(null);
  const jumpSound = useRef(null);
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const runSound = useRef(null);
  const laserSound = useRef(null);

  const jumpTargetY = (screen.height * 0.5) - 120;

  // Animations pour le splash screen
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(-100)).current;
  const sloganSlideAnim = useRef(new Animated.Value(100)).current;
  const subtitleSlideAnim = useRef(new Animated.Value(-100)).current;
  const levelSlideAnim = useRef(new Animated.Value(100)).current;
  const creditsSlideAnim = useRef(new Animated.Value(80)).current; // Changé de 50 à 80 pour partir plus bas
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Animations pour le menu des chapitres
  const menuTitleFadeAnim = useRef(new Animated.Value(0)).current;
  const menuTitleSlideAnim = useRef(new Animated.Value(-50)).current;
  const menuTitleScaleAnim = useRef(new Animated.Value(0.9)).current;
  const menuTitlePulseAnim = useRef(new Animated.Value(1)).current;
  const menuTitleRotateAnim = useRef(new Animated.Value(0)).current;

  const [userName, setUserName] = useState(null);
  const [userList, setUserList] = useState([]);

  // --- HOOKS D'EFFET ---

  useEffect(() => {
    // Gestion du splash screen avec animations
    const initializeSplashAnimations = async () => {
      // Animation d'apparition générale
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(titleSlideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sloganSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 400,
            useNativeDriver: true,
          }),
          Animated.timing(levelSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 600,
            useNativeDriver: true,
          }),
          Animated.timing(creditsSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 1000, // Augmenté de 800 à 1000 pour arriver plus tard
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Animation de rotation continue pour le titre
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de pulsation pour le titre
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de brillance pour le titre
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    };

    initializeSplashAnimations();

    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    // Verrouillage de l'orientation en mode paysage
    const lockOrientation = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        // Erreur silencieuse
      }
    };
    
    lockOrientation();
    
    // Vérification périodique de l'orientation
    const orientationCheck = setInterval(async () => {
      try {
        const currentOrientation = await ScreenOrientation.getOrientationAsync();
        if (currentOrientation !== ScreenOrientation.Orientation.LANDSCAPE_LEFT && 
            currentOrientation !== ScreenOrientation.Orientation.LANDSCAPE_RIGHT) {
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        }
      } catch (error) {
        // Erreur silencieuse
      }
    }, 2000);

    return () => {
      clearInterval(orientationCheck);
    };
  }, []);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreen(window);
      const newGroundY = window.height - GROUND_HEIGHT - PLAYER_RADIUS * 2;
      setGroundY(newGroundY);
      playerY.setValue(newGroundY);
    });
    return () => {
      subscription?.remove();
      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (selectedChapter && questionsLibrary.maths[selectedChapter]) {
      const chapterData = questionsLibrary.maths[selectedChapter];
      const formattedQuestions = chapterData.map(q => {
        const allAnswers = [q.correct, ...(q.wrongs || [])];
        const shuffled = shuffleArray([...allAnswers]);
        const correctIndex = shuffled.findIndex(ans => ans === q.correct);
        return { ...q, answers: shuffled, correctIndex: correctIndex };
      });
      setCurrentQuestions(shuffleArray(formattedQuestions));
      setCurrentQuestionIndex(0);
      setScore(0);
    } else {
      setCurrentQuestions([]);
    }
  }, [selectedChapter]);

  useEffect(() => {
    if (currentQuestions && currentQuestions[currentQuestionIndex]) {
      const toRead = currentQuestions[currentQuestionIndex].texteOral || currentQuestions[currentQuestionIndex].question;
      Speech.speak(toRead, { language: 'fr-FR' });
    }
    return () => {
      Speech.stop();
    };
  }, [currentQuestionIndex, currentQuestions]);

  useEffect(() => {
    if (currentQuestions.length === 0 || !currentQuestions[currentQuestionIndex]) {
      return;
    }

    setIsRoundActive(true);
    setFeedback('');

    const question = currentQuestions[currentQuestionIndex];
    const shuffledAnswers = shuffleArray(
      question.answers.map((answer, index) => ({ text: answer, isCorrect: index === question.correctIndex }))
    );

    const possibleHeights = [screen.height * 0.30, screen.height * 0.34, screen.height * 0.44, screen.height * 0.50];
    const shuffledLanes = shuffleArray(possibleHeights);

    const newBlocks = shuffledAnswers.map((answerData, index) => {
      const randomY = shuffledLanes[index % shuffledLanes.length];
      const startX = screen.width + index * (RECT_WIDTH + 220);
      const distance = startX + RECT_WIDTH;
      const duration = (distance / BLOCK_SPEED) * 1000;
      const horizontalAnimation = new Animated.Value(startX);

      return {
        id: index,
        text: answerData.text,
        isCorrect: answerData.isCorrect,
        isHit: false,
        animX: horizontalAnimation,
        animY: new Animated.Value(randomY),
        duration: duration,
      };
    });

    setAnswerBlocks(newBlocks);

    const onTimeout = () => {
      if (!isRoundActiveRef.current) return;
      setIsRoundActive(false);
      wrongSound.current?.replayAsync();
      setFeedback("Temps écoulé !");
      
      setMissedQuestions(prev => {
        const newArray = [...prev, currentQuestions[currentQuestionIndex]];
        return newArray;
      });
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          Speech.stop(); // Arrêter la lecture audio quand game over
          setTimeout(() => setIsGameOver(true), 1500);
        }
        return newLives;
      });
      
      setTimeout(() => {
        if (currentQuestionIndex === currentQuestions.length - 1) {
          Speech.stop(); // Arrêter la lecture audio quand fin de chapitre
          setIsChapterComplete(true);
        } else {
          setCurrentQuestionIndex(prevIndex => prevIndex + 1);
        }
      }, 1500);
    };

    newBlocks.forEach((block, index) => {
      Animated.timing(block.animX, {
        toValue: -RECT_WIDTH,
        duration: block.duration,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start(({ finished }) => {
        if (finished && index === newBlocks.length - 1) {
          onTimeout();
        }
      });
    });

    return () => {
      newBlocks.forEach(b => b.animX.stopAnimation());
    };
  }, [currentQuestionIndex, currentQuestions, screen.width]);

  const isRoundActiveRef = useRef(isRoundActive);
  useEffect(() => {
    isRoundActiveRef.current = isRoundActive;
  }, [isRoundActive]);

  useEffect(() => {
    if (!isRoundActive) return;
    const gameLoop = setInterval(() => {
      const playerCurrentX = playerX;
      const playerCurrentY = playerY._value;
      answerBlocks.forEach((block) => {
        if (block.isHit) return;
        const rectCurrentX = block.animX._value;
        const rectCurrentY = block.animY._value;
        const playerBox = { left: playerCurrentX, right: playerCurrentX + PLAYER_RADIUS * 2, top: playerCurrentY, bottom: playerCurrentY + PLAYER_RADIUS * 2 };
        const rectBox = { left: rectCurrentX, right: rectCurrentX + RECT_WIDTH, top: rectCurrentY, bottom: rectCurrentY + RECT_HEIGHT };
        const hasCollision = playerBox.right > rectBox.left && playerBox.left < rectBox.right && playerBox.bottom > rectBox.top && playerBox.top < rectBox.bottom;
        if (hasCollision) {
          handleAnswerCollision(block);
        }
      });
      projectiles.forEach((proj) => {
        const projX = proj.x;
        const projY = proj.anim._value;
        answerBlocks.forEach((block) => {
          if (block.isHit) return;
          const rectCurrentX = block.animX._value;
          const rectCurrentY = block.animY._value;
          const blockBox = { left: rectCurrentX, right: rectCurrentX + RECT_WIDTH, top: rectCurrentY, bottom: rectCurrentY + RECT_HEIGHT };
          if (projX > blockBox.left && projX < blockBox.right && projY > blockBox.top && projY < blockBox.bottom) {
            handleAnswerCollision(block);
            proj.anim.stopAnimation();
            setProjectiles((prev) => prev.filter((p) => p.id !== proj.id));
          }
        });
      });
    }, 16);
    return () => clearInterval(gameLoop);
  }, [playerX, playerY, answerBlocks, isRoundActive, projectiles]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (moveDirection === 'left') {
        setPlayerX(x => Math.max(x - 10, 0));
      } else if (moveDirection === 'right') {
        setPlayerX(x => Math.min(x + 10, screen.width - PLAYER_RADIUS * 2));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [moveDirection, screen.width]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSkyOffset(offset => {
        let next = offset - 1;
        if (next <= -screen.width) next = 0;
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [screen.width]);

  useEffect(() => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }
    if (moveDirection !== prevDirection.current) {
      if (moveDirection === 'right') setFrameIndex(RUN_RIGHT_START_INDEX);
      else if (moveDirection === 'left') setFrameIndex(RUN_LEFT_START_INDEX);
      else setFrameIndex(IDLE_FRAME_INDEX);
      prevDirection.current = moveDirection;
    } else if (moveDirection === null && frameIndex !== IDLE_FRAME_INDEX) {
      setFrameIndex(IDLE_FRAME_INDEX);
    }
    if (moveDirection === 'right' || moveDirection === 'left') {
      animationIntervalRef.current = setInterval(() => {
        setFrameIndex(prev => {
          if (moveDirection === 'right') return RUN_RIGHT_START_INDEX + ((prev - RUN_RIGHT_START_INDEX + 1) % RUN_RIGHT_FRAME_COUNT);
          if (moveDirection === 'left') return RUN_LEFT_START_INDEX + ((prev - RUN_LEFT_START_INDEX + 1) % RUN_LEFT_FRAME_COUNT);
          return IDLE_FRAME_INDEX;
        });
      }, ANIMATION_SPEED);
    }
    return () => { if (animationIntervalRef.current) clearInterval(animationIntervalRef.current); };
  }, [moveDirection]);

  useEffect(() => {
    const loadSounds = async () => {
      try {
        const [jump, correct, wrong, run, laser] = await Promise.all([
          Audio.Sound.createAsync(require('./assets/audio/jumpSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/correctSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/wrongSound.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/run.mp3')),
          Audio.Sound.createAsync(require('./assets/audio/laserSound.mp3')),
        ]);
        jumpSound.current = jump.sound;
        correctSound.current = correct.sound;
        wrongSound.current = wrong.sound;
        runSound.current = run.sound;
        laserSound.current = laser.sound;
      } catch (error) { 
        // Erreur silencieuse lors du chargement des sons
      }
    };
    loadSounds();
    return () => {
      jumpSound.current?.unloadAsync();
      correctSound.current?.unloadAsync();
      wrongSound.current?.unloadAsync();
      runSound.current?.unloadAsync();
      laserSound.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (moveDirection === 'left' || moveDirection === 'right') {
      runSound.current?.setIsLoopingAsync(true);
      runSound.current?.replayAsync();
    } else {
      runSound.current?.stopAsync();
    }
  }, [moveDirection]);

  // --- HOOKS D'EFFET ---

  useEffect(() => {
    // Gestion du splash screen
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 6000);

    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    if (moveDirection === 'left' || moveDirection === 'right') {
      runSound.current?.setIsLoopingAsync(true);
      runSound.current?.replayAsync();
    } else {
      runSound.current?.stopAsync();
    }
  }, [moveDirection]);

  // --- FONCTIONS DE GESTION DU JEU ---

  const handleAnswerCollision = (hitBlock) => {
    if (!isRoundActive) return;
    Speech.stop();
    setIsRoundActive(false);
    hitBlock.isHit = true;
    
    answerBlocks.forEach(b => b.animX.stopAnimation());

    if (isJumping) {
      playerY.stopAnimation();
      Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
    }
    answerBlocks.forEach(b => {
      Animated.timing(b.animY, { toValue: screen.height + RECT_HEIGHT, duration: 800, useNativeDriver: false }).start();
    });
    if (hitBlock.isCorrect) {
      correctSound.current?.replayAsync();
      setScore(s => s + 10);
      setFeedback('Correct !');
    } else {
      wrongSound.current?.replayAsync();
      setFeedback("Incorrect !");
      
      setMissedQuestions(prev => {
        const newArray = [...prev, currentQuestions[currentQuestionIndex]];
        return newArray;
      });
      setLives(prevLives => {
        const newLives = prevLives - 1;
        if (newLives <= 0) {
          Speech.stop(); // Arrêter la lecture audio quand game over
          setTimeout(() => setIsGameOver(true), 1500);
        }
        return newLives;
      });
    }
    
    setTimeout(() => {
      if (currentQuestionIndex === currentQuestions.length - 1) {
        Speech.stop(); // Arrêter la lecture audio quand fin de chapitre
        setIsChapterComplete(true);
      } else {
        setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      }
    }, 1500);
  };

  const jump = () => {
    if (isJumping || !isRoundActive) return;
    setIsJumping(true);
    jumpSound.current?.replayAsync();
    Animated.timing(playerY, { toValue: jumpTargetY, duration: JUMP_DURATION, useNativeDriver: false }).start(({ finished }) => {
      if (finished) {
        Animated.timing(playerY, { toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false }).start(() => setIsJumping(false));
      }
    });
  };

  const handlePower = () => {
    laserSound.current?.replayAsync();
    if (!isRoundActive) return;
    // Position de départ ajustée pour sortir du sac à dos
    const startX = playerX + PLAYER_RADIUS - 15;  // Décalée vers la gauche
    const startY = playerY._value + FRAME_HEIGHT / 2 - 20;  // Légèrement plus bas
    const id = Date.now() + Math.random();
    const animValue = new Animated.Value(startY);
    const newProjectile = { id, x: startX, anim: animValue };
    setProjectiles((prev) => [...prev, newProjectile]);
    Animated.timing(animValue, { toValue: -40, duration: 700, useNativeDriver: false }).start(() => {
      setProjectiles((prev) => prev.filter((p) => p.id !== id));
    });
  };

  const repeatQuestion = () => {
    if (currentQuestions && currentQuestions[currentQuestionIndex]) {
      const toRead = currentQuestions[currentQuestionIndex].texteOral || currentQuestions[currentQuestionIndex].question;
      Speech.speak(toRead, { language: 'fr-FR' });
    }
  };

  let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
  const handleTapOrSwipe = (evt, gestureState) => {
    if (!isRoundActive) return;
    const dx = gestureState.moveX - touchStartX;
    const dy = gestureState.moveY - touchStartY;
    const dt = Date.now() - touchStartTime;
    if (Math.abs(dy) > 40 && dy < -20 && Math.abs(dx) < 60 && dt < 500) {
      jump();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        touchStartX = gestureState.x0;
        touchStartY = gestureState.y0;
        touchStartTime = Date.now();
        const playerCenterX = playerX + PLAYER_RADIUS;
        if (gestureState.x0 > playerCenterX) {
          setMoveDirection('right');
        } else {
          setMoveDirection('left');
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const x = gestureState.moveX;
        const playerCenterX = playerX + PLAYER_RADIUS;
        if (x > playerCenterX + 4) {
          setMoveDirection('right');
        } else if (x < playerCenterX - 4) {
          setMoveDirection('left');
        } else {
          setMoveDirection(null);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleTapOrSwipe(evt, gestureState);
        setMoveDirection(null);
      },
    })
  ).current;

  const handleRestart = () => {
    Speech.stop(); // Arrêter la lecture audio
    setIsGameOver(false);
    setIsChapterComplete(false);
    setScore(0);
    setLives(7);
    setMissedQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedChapter(null); // Go back to chapter selection
    setShowBilan(false);
    setCurrentBilanIndex(0);
  };

  const handleReturnToMenu = () => {
    Speech.stop(); // Arrêter la lecture audio
    setIsGameOver(false);
    setIsChapterComplete(false);
    setScore(0);
    setLives(7);
    setMissedQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedChapter(null);
    setShowBilan(false);
    setCurrentBilanIndex(0);
  };

  // --- AFFICHAGE (RENDER) ---

  useEffect(() => {
    const initializeApp = async () => {
      await lockOrientation();
      await loadSounds();
      
      // Animation du splash screen
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(titleSlideAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(sloganSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 200,
            useNativeDriver: true,
          }),
          Animated.timing(subtitleSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 400,
            useNativeDriver: true,
          }),
          Animated.timing(levelSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 600,
            useNativeDriver: true,
          }),
          Animated.timing(creditsSlideAnim, {
            toValue: 0,
            duration: 800,
            delay: 1000, // Augmenté de 800 à 1000 pour arriver plus tard
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      // Animation de rotation continue pour le titre
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de pulsation pour le titre
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de brillance pour le titre
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();

      setTimeout(() => {
        setShowSplash(false);
      }, 6000);
    };

    initializeApp();
  }, []);

  // Animation du titre du menu des chapitres
  useEffect(() => {
    if (!showSplash && !selectedChapter) {
      // Animation d'apparition du titre du menu
      Animated.parallel([
        Animated.timing(menuTitleFadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(menuTitleSlideAnim, {
          toValue: 0,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(menuTitleScaleAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start();

      // Animation de pulsation continue pour le titre du menu
      Animated.loop(
        Animated.sequence([
          Animated.timing(menuTitlePulseAnim, {
            toValue: 1.05,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(menuTitlePulseAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Animation de rotation subtile pour le titre du menu
      Animated.loop(
        Animated.sequence([
          Animated.timing(menuTitleRotateAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }),
          Animated.timing(menuTitleRotateAnim, {
            toValue: 0,
            duration: 4000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [showSplash, selectedChapter]);

  // Charger la liste des utilisateurs et l'utilisateur courant au lancement
  useEffect(() => {
    AsyncStorage.getItem('USERS_LIST').then(list => {
      setUserList(list ? JSON.parse(list) : []);
    });
    AsyncStorage.getItem('CURRENT_USER').then(name => {
      if (name) setUserName(name);
    });
  }, []);

  // Fonction pour sélectionner un utilisateur
  const handleSelectUser = async (name) => {
    await AsyncStorage.setItem('CURRENT_USER', name);
    setUserName(name);
  };

  // Fonction pour ajouter un utilisateur
  const handleAddUser = async (name) => {
    const newList = [...userList, name];
    await AsyncStorage.setItem('USERS_LIST', JSON.stringify(newList));
    await AsyncStorage.setItem('CURRENT_USER', name);
    setUserList(newList);
    setUserName(name);
  };

  // Fonction pour changer d'utilisateur
  const handleChangeUser = async () => {
    await AsyncStorage.removeItem('CURRENT_USER');
    setUserName(null);
  };

  // Affichage de l'écran de sélection/ajout d'utilisateur si pas d'utilisateur courant
  if (!userName) {
    return <UserSelectScreen users={userList} onSelectUser={handleSelectUser} onAddUser={handleAddUser} />;
  }

  if (showSplash) {
    const spin = rotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '5deg']
    });

    return (
      <Animated.View style={[styles.splashContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] }]}>
        <Image source={splashImage} style={styles.splashImage} resizeMode="cover" />
        <Animated.View style={[styles.splashOverlay, { opacity: fadeAnim }]}>
          <Animated.Text 
            style={[
              styles.splashTitle, 
              { 
                transform: [
                  { translateX: titleSlideAnim },
                  { rotate: spin },
                  { scale: pulseAnim }
                ] 
              }
            ]}
          >
            KLATA
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.splashSlogan, 
              { transform: [{ translateX: sloganSlideAnim }] }
            ]}
          >
            Amusons-nous à apprendre
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.splashSubtitle, 
              { transform: [{ translateX: subtitleSlideAnim }] }
            ]}
          >
            MATHEMATIQUES
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.splashLevel, 
              { transform: [{ translateX: levelSlideAnim }] }
            ]}
          >
            Niveau 3ème, format APC
          </Animated.Text>
          <Animated.View 
            style={[
              styles.splashCredits, 
              { transform: [{ translateY: creditsSlideAnim }] }
            ]}
          >
            <Text style={styles.splashCreditText}>Créé par Aboya Guy Martial NANOU</Text>
            <Text style={styles.splashDateText}>21 juin 2025</Text>
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  }

  if (isGameOver) {
    const maxScore = currentQuestions.length * 10;
    const finalGrade = maxScore > 0 ? ((score / maxScore) * 20).toFixed(1) : 0;

    if (showBilan) {
      const currentError = missedQuestions[currentBilanIndex];
      return (
        <View style={styles.bilanContainer}>
          <Text style={styles.bilanTitle}>📊 Bilan des erreurs</Text>
          <Text style={styles.bilanCounterText}>{currentBilanIndex + 1} / {missedQuestions.length}</Text>
          
          <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 20 }}>
            {missedQuestions.length > 0 && currentError ? (
              <View key={currentBilanIndex} style={styles.bilanQuestionContainer}>
                <View style={styles.bilanQuestionSection}>
                  <Text style={styles.bilanQuestionLabel}>❌ Question {currentBilanIndex + 1}:</Text>
                  <View style={styles.bilanQuestionContent}>
                    <MathRenderer 
                      math={currentError.question} 
                      color="black" 
                      fontSize={16}
                    />
                  </View>
                </View>
                
                <View style={styles.bilanAnswerSection}>
                  <Text style={styles.bilanAnswerLabel}>✅ Réponse correcte:</Text>
                  <View style={styles.bilanAnswerContent}>
                    <MathRenderer 
                      math={currentError.correct} 
                      color="green" 
                      fontSize={16}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.noMissedQuestionsText}>Pas d'erreurs à afficher.</Text>
            )}
          </View>

          {missedQuestions.length > 1 && (
            <View style={styles.bilanNavigation}>
              <TouchableOpacity
                onPress={() => setCurrentBilanIndex(i => i - 1)}
                disabled={currentBilanIndex === 0}
                style={[styles.bilanNavButton, currentBilanIndex === 0 && styles.disabledButton]}
              >
                <Text style={styles.bilanNavButtonText}>Précédent</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentBilanIndex(i => i + 1)}
                disabled={currentBilanIndex >= missedQuestions.length - 1}
                style={[styles.bilanNavButton, currentBilanIndex >= missedQuestions.length - 1 && styles.disabledButton]}
              >
                <Text style={styles.bilanNavButtonText}>Suivant</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => setShowBilan(false)}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          
          {currentBilanIndex === missedQuestions.length - 1 && (
            <TouchableOpacity style={styles.restartButton} onPress={handleReturnToMenu}>
              <Text style={styles.restartButtonText}>Retour au menu</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverTitle}>Game Over</Text>
        <Text style={styles.finalScoreTextSmall}>Score : {score} / {maxScore}</Text>
        <Text style={styles.finalScoreTextSmall}>Note finale : {finalGrade} / 20</Text>
        
        <TouchableOpacity style={styles.bilanButton} onPress={() => { setShowBilan(true); setCurrentBilanIndex(0); }}>
          <Text style={styles.bilanButtonText}>📊 Voir le bilan des erreurs</Text>
        </TouchableOpacity>

        {missedQuestions.length === 0 && (
          <TouchableOpacity style={styles.restartButton} onPress={handleRestart}>
            <Text style={styles.restartButtonText}>Retour au menu</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  
  if (isChapterComplete) {
    const maxScore = currentQuestions.length * 10;
    const finalGrade = maxScore > 0 ? ((score / maxScore) * 20).toFixed(1) : 0;

    if (showBilan) {
      const currentError = missedQuestions[currentBilanIndex];
      return (
        <View style={styles.bilanContainer}>
          <Text style={styles.bilanTitle}>📊 Bilan des erreurs</Text>
          <Text style={styles.bilanCounterText}>{currentBilanIndex + 1} / {missedQuestions.length}</Text>
          
          <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 20 }}>
            {missedQuestions.length > 0 && currentError ? (
              <View key={currentBilanIndex} style={styles.bilanQuestionContainer}>
                <View style={styles.bilanQuestionSection}>
                  <Text style={styles.bilanQuestionLabel}>❌ Question {currentBilanIndex + 1}:</Text>
                  <View style={styles.bilanQuestionContent}>
                    <MathRenderer 
                      math={currentError.question} 
                      color="black" 
                      fontSize={16}
                    />
                  </View>
                </View>
                
                <View style={styles.bilanAnswerSection}>
                  <Text style={styles.bilanAnswerLabel}>✅ Réponse correcte:</Text>
                  <View style={styles.bilanAnswerContent}>
                    <MathRenderer 
                      math={currentError.correct} 
                      color="green" 
                      fontSize={16}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <Text style={styles.noMissedQuestionsText}>🎉 Félicitations, aucune erreur !</Text>
            )}
          </View>

          {missedQuestions.length > 1 && (
            <View style={styles.bilanNavigation}>
              <TouchableOpacity
                onPress={() => setCurrentBilanIndex(i => i - 1)}
                disabled={currentBilanIndex === 0}
                style={[styles.bilanNavButton, currentBilanIndex === 0 && styles.disabledButton]}
              >
                <Text style={styles.bilanNavButtonText}>Précédent</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentBilanIndex(i => i + 1)}
                disabled={currentBilanIndex >= missedQuestions.length - 1}
                style={[styles.bilanNavButton, currentBilanIndex >= missedQuestions.length - 1 && styles.disabledButton]}
              >
                <Text style={styles.bilanNavButtonText}>Suivant</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.backButton} onPress={() => setShowBilan(false)}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          
          {currentBilanIndex === missedQuestions.length - 1 && (
            <TouchableOpacity style={styles.restartButton} onPress={handleReturnToMenu}>
              <Text style={styles.restartButtonText}>Retour au menu</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.gameOverContainer}>
        <Text style={[styles.gameOverTitle, { color: '#1976d2' }]}>Fin de Partie !</Text>
        <Text style={styles.finalScoreTextSmall}>Score : {score} / {maxScore}</Text>
        <Text style={styles.finalScoreTextSmall}>Note finale : {finalGrade} / 20</Text>
        
        <TouchableOpacity style={styles.bilanButton} onPress={() => { setShowBilan(true); setCurrentBilanIndex(0); }}>
          <Text style={styles.bilanButtonText}>📊 Voir le bilan des erreurs</Text>
        </TouchableOpacity>

        {missedQuestions.length === 0 && (
          <TouchableOpacity style={styles.restartButton} onPress={handleReturnToMenu}>
            <Text style={styles.restartButtonText}>Retour au menu</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (!selectedChapter) {
    const menuTitleSpin = menuTitleRotateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['-2deg', '2deg']
    });

    return (
      <View style={styles.menuContainer}>
        <View style={styles.menuHeaderRow}>
          <TouchableOpacity style={styles.changeUserButtonAbsolute} onPress={handleChangeUser}>
            <Text style={styles.changeUserButtonText}>Changer d'utilisateur</Text>
          </TouchableOpacity>
          <View style={styles.menuTitleAbsoluteCenter}>
            <Animated.Text 
              style={[
                styles.menuTitle, 
                { 
                  opacity: menuTitleFadeAnim,
                  transform: [
                    { translateX: menuTitleSlideAnim },
                    { scale: menuTitleScaleAnim },
                    { scale: menuTitlePulseAnim },
                    { rotate: menuTitleSpin }
                  ] 
                }
              ]}
            >
              Choisis un chapitre
            </Animated.Text>
          </View>
        </View>
        <FlatList
          data={chapterNames}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chapterButton} onPress={() => setSelectedChapter(item)}>
              <Text style={styles.chapterButtonText}>{item}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
        <Text style={{ marginTop: 12, color: '#333', fontStyle: 'italic' }}>
          Utilisateur : <Text style={{ fontWeight: 'bold', color: '#333' }}>{userName}</Text>
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.Image source={sky1} style={{ position: 'absolute', width: screen.width, height: screen.height, left: skyOffset, top: 0, zIndex: 0 }} resizeMode="cover" />
      <Animated.Image source={sky1} style={{ position: 'absolute', width: screen.width, height: screen.height, left: skyOffset + screen.width, top: 0, zIndex: 0 }} resizeMode="cover" />
      <ImageBackground 
        source={bgsta} 
        style={{ position: 'absolute', width: '100%', height: '100%' }} 
        resizeMode="cover"
        {...panResponder.panHandlers}
      >
        <View style={styles.container}>
          <View style={styles.uiContainer}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.scoreText}>Score: {score}</Text>
              <Text style={styles.livesText}>Vies: {lives} ❤️</Text>
            </View>
            <View style={styles.questionContainer}>
              <MathRenderer
                key={`question-${currentQuestionIndex}`}
                math={currentQuestions[currentQuestionIndex]?.question || ''}
                fontSize={Math.floor(getFontSizeForQuestion(currentQuestions[currentQuestionIndex]?.question) * 0.6)}
                color="#333"
              />
            </View>
            <View style={styles.topRightButtonsContainer}>
              <TouchableOpacity onPress={repeatQuestion} style={styles.iconButton}>
                  <Text style={styles.iconText}>🔊</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedChapter(null)} style={styles.iconButton}>
                  <Text style={styles.menuButtonText}>Menu</Text>
              </TouchableOpacity>
            </View>
          </View>
          {answerBlocks.map((block) => (
            <Animated.View 
                key={`block-${currentQuestionIndex}-${block.id}`} 
                style={[ styles.rect, { left: block.animX, top: block.animY, backgroundColor: block.isHit ? (block.isCorrect ? '#4CAF50' : '#F44336') : '#ff7043' } ]}
            >
              <MathRenderer
                math={block.text}
                color="white"
                fontSize={getFontSizeForAnswer(block.text)}
                style={{ textAlignVertical: 'center' }}
              />
            </Animated.View>
          ))}
          {projectiles.map((proj) => (
            <Animated.Image 
              key={proj.id} 
              source={fireballImage}
              style={{ 
                position: 'absolute',
                width: 40,  // Taille de la boule de feu
                height: 40, // Taille de la boule de feu
                left: proj.x, 
                top: proj.anim,
                zIndex: 5
              }} 
            />
          ))}
          <Animated.View style={{ position: 'absolute', left: playerX, top: playerY, width: FRAME_WIDTH, height: FRAME_HEIGHT, overflow: 'hidden', zIndex: 10 }}>
            <Image source={zadiSprite} style={{ width: FRAME_WIDTH * TOTAL_SPRITE_FRAMES, height: FRAME_HEIGHT, transform: [{ translateX: -frameIndex * FRAME_WIDTH }] }} resizeMode="stretch" />
          </Animated.View>
          <View style={[styles.ground, { width: screen.width, height: GROUND_HEIGHT, bottom: 0 }]} />
          <View style={styles.controlsContainer} pointerEvents="box-none">
            {/* Affichage de l'image associée à la question */}
            {currentQuestions[currentQuestionIndex]?.imgKey && questionImages[currentQuestions[currentQuestionIndex].imgKey] && (
              <Image 
                source={questionImages[currentQuestions[currentQuestionIndex].imgKey]} 
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
            
            <TouchableOpacity style={[styles.controlButton, styles.leftButton]} onPressIn={() => setMoveDirection('left')} onPressOut={() => setMoveDirection(null)}>
              <Text style={styles.controlButtonText}>{'◀'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#e53935', marginLeft: 12 }]} onPress={handlePower}>
              <Text style={[styles.controlButtonText, { color: '#fff', fontSize: 36 }]}>🔥</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <TouchableOpacity style={[styles.controlButton, styles.jumpButton]} onPress={jump} />
              <TouchableOpacity style={[styles.controlButton, styles.rightButton]} onPressIn={() => setMoveDirection('right')} onPressOut={() => setMoveDirection(null)}>
                <Text style={styles.controlButtonText}>{'▶'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  menuContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#03A6A1', // Nouvelle couleur de fond - bleu foncé élégant
    paddingTop: 20, 
    paddingBottom: 20,
  },
  menuTitle: { 
    fontSize: 42, // Plus grand pour plus d'impact
    fontWeight: '900', // Comme le titre KLATA
    color: 'rgb(240, 108, 13)', // Orange doré du splash
    marginBottom: 40, // Plus d'espace
    textAlign: 'center',
    textShadowColor: 'rgb(255, 255, 255)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    letterSpacing: 3, // Espacement des lettres
    fontFamily: 'System',
    // Effet de lueur dorée comme KLATA
    shadowColor: 'rgb(255, 255, 255)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  chapterButton: { 
    backgroundColor: 'rgba(11, 133, 70, 0.9)', // Même orange que "Niveau 3ème"
    borderRadius: 40, // Plus arrondi
    paddingVertical: 10, // Plus d'espace vertical
    paddingHorizontal: 20, // Plus d'espace horizontal
    marginVertical: 15, // Plus d'espacement entre les boutons
    width: Dimensions.get('window').width * 0.88, // Légèrement plus large
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 12, // Ombre plus prononcée
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    // Bordure dorée subtile
    borderWidth: 2,
    borderColor: 'rgb(255, 255, 255)',
  },
  chapterButtonText: { 
    color: 'rgba(255, 255, 255, 0.9)', 
    fontSize: 22, // Plus grand pour plus de lisibilité
    fontWeight: 'bold', 
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 1,
    fontFamily: 'System',
  },
  container: { flex: 1 },
  uiContainer: { position: 'absolute', top: 10, width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  scoreText: { fontSize: 20, fontWeight: 'bold', color: '#00796b', width: 100 },
  topRightButtonsContainer: { flexShrink: 0, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginRight: 25 },
  iconButton: { padding: 8 },
  iconText: { fontSize: 24 },
  menuButtonText: { color: '#00796b', fontWeight: 'bold', fontSize: 18 },
  questionContainer: { flex: 1, minHeight: 80, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, paddingVertical: 5 },
  rect: { position: 'absolute', width: 'auto', minWidth: RECT_WIDTH, paddingHorizontal: 15, height: RECT_HEIGHT, backgroundColor: '#ff7043', borderRadius: 8, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  projectile: { position: 'absolute', width: 20, height: 20, borderRadius: 10, backgroundColor: '#FFD600', borderWidth: 3, borderColor: '#fff', zIndex: 5 },
  projectile: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFEB3B',
    zIndex: 5,
  },
  ground: { position: 'absolute', left: 0, backgroundColor: '#388e3c', borderTopLeftRadius: 12, borderTopRightRadius: 12, zIndex: 1 },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  controlButton: { backgroundColor: '#fff', borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center', elevation: 4, borderWidth: 2, borderColor: '#1976d2', opacity: 0.4 },
  controlButtonText: { fontSize: 32, color: '#1976d2', fontWeight: 'bold' },
  leftButton: { alignSelf: 'flex-start' },
  jumpButton: { backgroundColor: '#FFD600', borderWidth: 0, borderColor: 'transparent', marginHorizontal: 16 },
  rightButton: { alignSelf: 'flex-end' },
  livesText: { fontSize: 20, fontWeight: 'bold', color: '#d32f2f', marginLeft: 15 },
  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', padding: 20 },
  gameOverTitle: { fontSize: 48, fontWeight: 'bold', color: '#c62828', marginBottom: 20 },
  finalScoreText: { fontSize: 24, color: '#37474f', marginBottom: 10 },
  finalScoreTextSmall: { fontSize: 18, color: '#37474f', marginBottom: 8, textAlign: 'center' },
  missedQuestionsTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, alignSelf: 'center' },
  missedQuestionContainer: { marginBottom: 20, padding: 10, backgroundColor: '#fff', borderRadius: 8, width: '90%', alignSelf: 'center' },
  restartButton: { backgroundColor: '#1976d2', paddingVertical: 15, paddingHorizontal: 30, borderRadius: 10, marginTop: 20 },
  restartButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  noMissedQuestionsText: { fontSize: 18, color: 'green', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  questionImage: { 
    position: 'absolute',
    bottom: 90, 
    left: 35, 
    width: 167, 
    height: 167,
    borderRadius: 8,
    zIndex: 3,
    borderWidth: 3,
    borderColor: '#4CAF50'
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.12)', // Réduit de 0.6 à 0.3 pour plus de visibilité
    justifyContent: 'center',
    alignItems: 'center',
    // Ajout d'un dégradé radial pour plus de profondeur
    backgroundGradient: {
      colors: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)'],
      locations: [0, 1],
    },
  },
  splashTitle: {
    fontSize: 60,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 8,
    letterSpacing: 8,
    fontFamily: 'System',
    // Ajout d'un effet de lueur
    shadowColor: '#FFD600',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  splashSlogan: {
    fontSize: 18,
    color: '#FFD600',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 2,
  },
  splashSubtitle: {
    fontSize: 32,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 3,
  },
  splashLevel: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 140, // Réduit de 100 à 30 pour remonter le niveau
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(241, 95, 11, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  splashCredits: {
    position: 'absolute',
    bottom: 40, // Réduit de 60 à 40 pour être plus bas
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  splashCreditText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  splashDateText: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bilanButton: { 
    backgroundColor: '#ff9800', 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 8, 
    marginTop: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bilanButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bilanContainer: { 
    flex: 1, 
    backgroundColor: '#f7f9fc', // Fond plus clair
    paddingHorizontal: 10,
  },
  bilanTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#005a9c', // Bleu plus foncé
    textAlign: 'center', 
    marginVertical: 20,
  },
  bilanScrollView: { 
    flex: 1, 
  },
  bilanQuestionContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eef2f7',
  },
  bilanQuestionSection: { 
    flex: 1,
    paddingRight: 10,
  },
  bilanQuestionLabel: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#c62828', // Rouge
    marginBottom: 8,
  },
  bilanQuestionContent: { 
    backgroundColor: '#fff', 
    borderWidth: 1,
    borderColor: '#e0e0e0',
    padding: 15, 
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  bilanAnswerSection: { 
    flex: 1,
    paddingLeft: 10,
  },
  bilanAnswerLabel: { 
    fontSize: 15, 
    fontWeight: 'bold', 
    color: '#2e7d32', // Vert
    marginBottom: 8,
  },
  bilanAnswerContent: { 
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    padding: 15, 
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  bilanNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 15,
  },
  bilanNavButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  bilanNavButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#bdbdbd',
    elevation: 0,
  },
  bilanCounterText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#37474f',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  backButton: { 
    backgroundColor: '#757575', 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderRadius: 8, 
    alignSelf: 'center',
    elevation: 2,
  },
  backButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
  changeUserButtonAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: '#e53935',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    zIndex: 2,
  },
  changeUserButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  menuHeaderRow: {
    width: '100%',
    height: 56, // augmenté pour plus de place
    marginBottom: 10,
    marginTop: 10,
    position: 'relative',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  menuTitleAbsoluteCenter: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // plus élevé que le bouton
    pointerEvents: 'none', // pour que le bouton reste cliquable
  },
  menuTitle: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 26,
    textAlign: 'center',
  },
});



