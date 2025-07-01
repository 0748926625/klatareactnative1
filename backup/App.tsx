// App.js - VERSION FINALE ET CORRIGÉE

import React, { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: useInsertionEffect must not schedule updates']); // Ignore RN Animated warning

import { checkTrialStatus, getSavedLicenseKey } from './utils/licensing';
import LicenseScreen from './components/LicenseScreen';

import {
  StyleSheet, View, Text, Animated, PanResponder, Dimensions,
  TouchableOpacity, ImageBackground, Image, Easing, FlatList,
  ScrollView, TextInput, ActivityIndicator
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import MathRenderer from './MathRenderer';
import { LineChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';

// --- ASSETS & IMAGES ---
import bgsta from './assets/backgrounds/bgsta.png';
import sky1 from './assets/backgrounds/sky1.png';
import zadiSprite from './assets/sprites/zadi.png';
import splashImage from './assets/splash.jpg';
import fireballImage from './assets/images/fireball.png';

// --- DONNÉES DE L'APPLICATION ---
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

// ==================================================================
// =================== VOTRE TÂCHE EST ICI ==========================
// ==================================================================
//
// Collez l'intégralité de votre objet `questionsLibrary` ici.
// J'ai laissé la structure avec quelques exemples pour vous guider.
//
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
// ==================================================================
// ===================== FIN DE VOTRE TÂCHE =========================
// ==================================================================


// --- CONSTANTES DU JEU ---
const PLAYER_RADIUS = 30, RECT_WIDTH = 210, RECT_HEIGHT = 65, JUMP_DURATION = 350, GROUND_HEIGHT = 40, FRAME_WIDTH = 64, FRAME_HEIGHT = 64, TOTAL_SPRITE_FRAMES = 13, IDLE_FRAME_INDEX = 0, RUN_RIGHT_START_INDEX = 1, RUN_RIGHT_FRAME_COUNT = 6, RUN_LEFT_START_INDEX = 7, RUN_LEFT_FRAME_COUNT = 6, ANIMATION_SPEED = 80, BLOCK_SPEED = 40;

// --- FONCTIONS UTILITAIRES ---
const getUserDataKey = (userName) => `USER_DATA_${userName.toUpperCase()}`;
const getDefaultUserData = (userName) => ({ userName, stats: { totalGames: 0, totalScore: 0, bestScores: {} }, history: [] });
const getUserData = async (userName) => {
  if (!userName) return null;
  try { const data = await AsyncStorage.getItem(getUserDataKey(userName)); return data ? JSON.parse(data) : getDefaultUserData(userName); } catch (e) { console.error("Erreur de récupération des données utilisateur:", e); return getDefaultUserData(userName); }
};
const saveGameResult = async (userName, result) => {
  if (!userName || !result) return;
  try { const userData = await getUserData(userName); userData.history.unshift({ ...result, id: ''+Date.now() }); userData.stats.totalGames++; userData.stats.totalScore += result.grade; const best = userData.stats.bestScores[result.chapter] || 0; if (result.grade > best) { userData.stats.bestScores[result.chapter] = result.grade; } await AsyncStorage.setItem(getUserDataKey(userName), JSON.stringify(userData)); } catch (e) { console.error("Erreur de sauvegarde du résultat:", e); }
};
const shuffleArray = (a) => { let newArray = [...a]; for (let i = newArray.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; } return newArray; };
const getFontSizeForQuestion = (q = '') => q.length > 100 ? 20 : (q.length > 60 ? 24 : 32);
const getFontSizeForAnswer = (a = '') => a.length > 100 ? 10 : (a.length > 80 ? 12 : (a.length > 50 ? 14 : (a.length > 30 ? 16 : (a.length > 15 ? 18 : 20))));
const getFontSizeForTableCell = (text = '') => {
  if (text.length > 80) return 10; // Augmenté de 8 à 10
  if (text.length > 50) return 12; // Augmenté de 10 à 12
  return 14; // Augmenté de 12 à 14
};


// --- COMPOSANTS D'INTERFACE CENTRALISÉS ---
const UserSelectScreen = ({ users, onSelectUser, onAddUser }) => {
    const [newUserName, setNewUserName] = useState(''); const [isAdding, setIsAdding] = useState(false); const handleAdd = () => { if (newUserName.trim()) { onAddUser(newUserName.trim()); } };
    if (isAdding || users.length === 0) { return (<View style={styles.userSelectContainer}><Text style={styles.menuTitle}>Créer un joueur</Text><TextInput style={styles.userInput} placeholder="Entrez votre nom" value={newUserName} onChangeText={setNewUserName} placeholderTextColor="#888" /><TouchableOpacity style={styles.userButton} onPress={handleAdd}><Text style={styles.userButtonText}>Commencer !</Text></TouchableOpacity>{users.length > 0 && <TouchableOpacity onPress={() => setIsAdding(false)}><Text style={styles.switchUserText}>Ou choisir un joueur existant</Text></TouchableOpacity>}</View>); }
    return (<View style={styles.userSelectContainer}><Text style={styles.menuTitle}>Choisir un joueur</Text><FlatList data={users} keyExtractor={(item) => item} renderItem={({ item }) => <TouchableOpacity style={styles.userButton} onPress={() => onSelectUser(item)}><Text style={styles.userButtonText}>{item}</Text></TouchableOpacity>} /><TouchableOpacity onPress={() => setIsAdding(true)}><Text style={styles.switchUserText}>+ Ajouter un nouveau joueur</Text></TouchableOpacity></View>);
};
// ... (gardez tous les imports et le reste du code App.js)

// --- COMPOSANTS D'INTERFACE CENTRALISÉS ---
// ... (gardez le composant UserSelectScreen)

const ProfileScreen = ({ userName, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(null);
  // NOUVEL ÉTAT POUR LES DONNÉES DU TABLEAU
  const [problematicQuestions, setProblematicQuestions] = useState([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);

  useEffect(() => {
      const loadData = async () => {
          setLoading(true);
          const data = await getUserData(userName);
          setUserData(data);
          if (data && data.history && data.history.length > 0) {
              const chapters = [...new Set(data.history.map(item => item.chapter))];
              if (chapters.length > 0) {
                  setSelectedChapter(chapters[0]);
              }
          }
          setLoading(false);
      };
      loadData();
  }, [userName]);

  // NOUVEL EFFET POUR CALCULER LES QUESTIONS PROBLÉMATIQUES
  useEffect(() => {
      if (!userData || !selectedChapter) {
          setProblematicQuestions([]);
          return;
      }

      // 1. Agréger les échecs par question
      const failureCounts = new Map();
      userData.history
          .filter(game => game.chapter === selectedChapter)
          .flatMap(game => game.missedQuestions || []) // flatMap pour créer une seule liste d'erreurs
          .forEach(missedQ => {
              const key = missedQ.question; // La question LaTeX sert de clé unique
              if (failureCounts.has(key)) {
                  failureCounts.get(key).count++;
              } else {
                  failureCounts.set(key, {
                      questionObject: missedQ,
                      count: 1
                  });
              }
          });

      // 2. Convertir la Map en tableau et trier par nombre d'échecs (décroissant)
      const sortedData = Array.from(failureCounts.values())
          .sort((a, b) => b.count - a.count);

      setProblematicQuestions(sortedData);
      setCurrentProblemIndex(0);

  }, [userData, selectedChapter]); // Se recalcule si les données ou le chapitre changent

  const renderChart = () => {
      if (!userData || !userData.history || userData.history.length === 0) {
          return <Text style={styles.profileInfoText}>Aucune donnée de partie pour le moment.</Text>;
      }

      let chapterData = [];
      if (selectedChapter === 'Tous les chapitres') {
          // Si "Tous les chapitres" est sélectionné, on prend toutes les données d'historique
          chapterData = userData.history
            .slice(0, 20) // On prend les 20 dernières parties globales
            .reverse();
      } else if (selectedChapter) {
          // Sinon, on filtre par chapitre comme avant
          chapterData = userData.history
            .filter(item => item.chapter === selectedChapter)
            .slice(0, 20) // On prend les 20 dernières parties pour ce chapitre
            .reverse();
      }

      if (chapterData.length === 0) {
          return <Text style={styles.profileInfoText}>Aucune partie trouvée pour ce chapitre ou pour tous les chapitres.</Text>;
      }

      const chartData = {
          labels: chapterData.map((item, index) => String(index + 1)),
          datasets: [{
              data: chapterData.map(item => item.grade || 0),
              color: (opacity = 1) => `rgba(255, 215, 0, ${opacity})`,
              strokeWidth: 5
          }]
      };
      return (
          <LineChart
              data={chartData} width={SCREEN_WIDTH - 40} height={220} yAxisLabel="" yAxisSuffix="/20" yAxisInterval={1} chartConfig={chartConfig} bezier style={{ marginVertical: 8, borderRadius: 16 }}
              getDotColor={(dataPoint) => dataPoint >= 10 ? '#4CAF50' : '#F44336'}
          />
      );
  };

  if (loading) {
      return <View style={styles.profileContainer}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }
  
  if (!userData) {
      return <View style={styles.profileContainer}><Text>Impossible de charger les données.</Text></View>;
  }

  const allChapterNames = Object.keys(questionsLibrary.maths || {});
    const availableChapters = userData && userData.history ? ['Tous les chapitres', ...new Set(userData.history.map(item => item.chapter))] : ['Tous les chapitres'];

  return (
      <ImageBackground source={bgsta} style={styles.fullScreen}>
          <ScrollView contentContainerStyle={styles.profileContainer}>
              <Text style={styles.profileTitle}>Profil de {userName}</Text>
              
              <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Statistiques Globales</Text>
                  <Text style={styles.profileInfoText}>Parties jouées: {userData.stats.totalGames}</Text>
                  <Text style={styles.profileInfoText}>Score Total: {userData.stats.totalScore}</Text>
              </View>
              
              <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Évolution par Chapitre</Text>
                  {availableChapters.length > 0 ? (
                      <View style={styles.pickerContainer}>
                          <Picker selectedValue={selectedChapter} onValueChange={(itemValue) => setSelectedChapter(itemValue)} style={styles.picker}>
                              {availableChapters.map(chap => <Picker.Item key={chap} label={chap} value={chap} />)}
                          </Picker>
                      </View>
                  ) : (
                      <Text style={styles.profileInfoText}>Jouez à un chapitre pour voir vos statistiques.</Text>
                  )}
                  {renderChart()}
              </View>

              {/* BLOC REMANIÉ : NAVIGATION SUR UNE QUESTION À LA FOIS */}
              <View style={styles.statsContainer}>
                  <Text style={styles.statsTitle}>Questions à revoir</Text>
                  {problematicQuestions.length > 0 ? (
                      <>
                        <Text style={styles.bilanCounterText}>{currentProblemIndex+1}/{problematicQuestions.length}</Text>
                        <View style={styles.bilanQuestionSection}>
                          <Text style={styles.bilanQuestionLabel}>Question :</Text>
                          <View style={styles.bilanQuestionContent}>
                            <MathRenderer math={problematicQuestions[currentProblemIndex].questionObject.question} fontSize={getFontSizeForTableCell(problematicQuestions[currentProblemIndex].questionObject.question)} color="black" style={{ flexWrap: 'wrap' }} />
                          </View>
                        </View>
                        <View style={styles.bilanAnswerSection}>
                          <Text style={styles.bilanAnswerLabel}>Réponse correcte :</Text>
                          <View style={styles.bilanAnswerContent}>
                            <MathRenderer math={problematicQuestions[currentProblemIndex].questionObject.correct} fontSize={getFontSizeForTableCell(problematicQuestions[currentProblemIndex].questionObject.correct)} color="#4CAF50" style={{ flexWrap: 'wrap' }} />
                          </View>
                        </View>
                        <View style={styles.bilanNavigation}>
                          <TouchableOpacity onPress={()=>setCurrentProblemIndex(i=>i-1)} disabled={currentProblemIndex===0} style={[styles.bilanNavButton,currentProblemIndex===0&&styles.disabledButton]}>
                            <Text style={styles.bilanNavButtonText}>Précédent</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={()=>setCurrentProblemIndex(i=>i+1)} disabled={currentProblemIndex>=problematicQuestions.length-1} style={[styles.bilanNavButton,currentProblemIndex>=problematicQuestions.length-1&&styles.disabledButton]}>
                            <Text style={styles.bilanNavButtonText}>Suivant</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                  ) : (
                      <Text style={styles.profileInfoText}>Aucune erreur répétée pour ce chapitre. Bravo !</Text>
                  )}
              </View>
              
              <TouchableOpacity style={styles.backButton} onPress={onBack}>
                  <Text style={styles.backButtonText}>Retour au menu</Text>
              </TouchableOpacity>
          </ScrollView>
      </ImageBackground>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function App() {
  const [currentView, setCurrentView] = useState('splash');
  const [showSplash, setShowSplash] = useState(true);
  const [isLicensed, setIsLicensed] = useState(false);
  const [showLicenseScreen, setShowLicenseScreen] = useState(false);
  // CORRECTION: Initialisation paresseuse pour éviter l'erreur "screen doesn't exist"
  const [screen, setScreen] = useState(() => Dimensions.get('window'));
  const [userName, setUserName] = useState(null);
  const [userList, setUserList] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const chapterNames = Object.keys(questionsLibrary.maths || {});
  const [groundY, setGroundY] = useState(() => screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2);
  const [playerX, setPlayerX] = useState(() => screen.width / 2 - PLAYER_RADIUS);
  const playerY = useRef(new Animated.Value(screen.height - GROUND_HEIGHT - PLAYER_RADIUS * 2)).current;
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerBlocks, setAnswerBlocks] = useState([]);
  const [projectiles, setProjectiles] = useState([]);
  const [isJumping, setIsJumping] = useState(false);
  const [isRoundActive, setIsRoundActive] = useState(true);
  const isRoundActiveRef = useRef(isRoundActive);
  const [moveDirection, setMoveDirection] = useState(null);
  const [skyOffset, setSkyOffset] = useState(0);
  const [frameIndex, setFrameIndex] = useState(IDLE_FRAME_INDEX);
  const [lives, setLives] = useState(7);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [showBilan, setShowBilan] = useState(false);
  const [currentBilanIndex, setCurrentBilanIndex] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]); // Pour les messages flottants
  const animationIntervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const questionOpacityAnim = useRef(new Animated.Value(0)).current;
  const questionTimeoutRef = useRef(null); // <-- NOUVELLE LIGNE POUR LE TIMEOUT
  const jumpSound = useRef(null), correctSound = useRef(null), wrongSound = useRef(null), runSound = useRef(null), laserSound = useRef(null);

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
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Gestion d'une éventuelle période d'essai --------------------------------
  const [onTrial, setOnTrial] = useState(false);
  const [trialTimeLeft, setTrialTimeLeft] = useState(0); // millisecondes

  // Helper pour formater le temps restant (HH:MM:SS)
  const formatTime = (ms: number) => {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    const init = async () => {
      const storedUser = await AsyncStorage.getItem('CURRENT_USER');
      const userListStored = await AsyncStorage.getItem('USERS_LIST');
      if (storedUser) setUserName(storedUser);
      if (userListStored) setUserList(JSON.parse(userListStored));

      const { trialActive, timeLeft } = await checkTrialStatus();
      const savedLicense = await getSavedLicenseKey();

      if (savedLicense) {
        setIsLicensed(true);
      } else if (trialActive) {
        // Période d'essai active
        setIsLicensed(true);
        setOnTrial(true);
        setTrialTimeLeft(timeLeft);
      } else {
        setShowLicenseScreen(true); // Trial expired and no license, show license screen
      }

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
        if (!showLicenseScreen) {
          setCurrentView(storedUser ? 'menu' : 'user_select');
        }
      }, 6000); // Durée totale de l'animation du splash
    };
    init();
    const loadSounds = async () => {
      try {
        const { sound: jump } = await Audio.Sound.createAsync(require('./assets/audio/jumpSound.mp3')); jumpSound.current = jump;
        const { sound: correct } = await Audio.Sound.createAsync(require('./assets/audio/correctSound.mp3')); correctSound.current = correct;
        const { sound: wrong } = await Audio.Sound.createAsync(require('./assets/audio/wrongSound.mp3')); wrongSound.current = wrong;
        const { sound: run } = await Audio.Sound.createAsync(require('./assets/audio/run.mp3')); runSound.current = run;
        const { sound: laser } = await Audio.Sound.createAsync(require('./assets/audio/laserSound.mp3')); laserSound.current = laser;
      } catch (error) { console.warn("Erreur chargement sons:", error); }
    };
    loadSounds();
    return () => { jumpSound.current?.unloadAsync(); correctSound.current?.unloadAsync(); wrongSound.current?.unloadAsync(); runSound.current?.unloadAsync(); laserSound.current?.unloadAsync(); }
  }, []);
  
  useEffect(() => { isRoundActiveRef.current = isRoundActive; }, [isRoundActive]);
  useEffect(() => { if (selectedChapter) { const d = questionsLibrary.maths[selectedChapter]; const fq = d.map(q => ({ ...q, allAnswers: shuffleArray([q.correct, ...(q.wrongs || [])]) })); setCurrentQuestions(shuffleArray(fq)); setCurrentQuestionIndex(0); setScore(0); setLives(7); setMissedQuestions([]); setCurrentView('game'); } }, [selectedChapter]);
  useEffect(() => {
    if (currentView !== 'game' || !currentQuestions[currentQuestionIndex]) return;

    // 1. On masque immédiatement la question et on prépare la nouvelle manche
    questionOpacityAnim.setValue(0);
    setIsRoundActive(false); // La manche n'est pas jouable pendant le rendu

    const q = currentQuestions[currentQuestionIndex];
    Speech.speak(q.texteOral || q.question, { language: 'fr-FR' });
    const l = shuffleArray([screen.height * .3, screen.height * .34, screen.height * .44, screen.height * .5]);
    
    // 2. On crée les blocs réponses, mais ils sont initialement invisibles
    const blocks = q.allAnswers.map((a, i) => {
      const x = screen.width + i * (RECT_WIDTH + 220);
      return {
        id: Date.now() + i,
        text: a,
        isCorrect: a === q.correct,
        isHit: false,
        animX: new Animated.Value(x),
        animY: new Animated.Value(l[i % 4]),
        scaleAnim: new Animated.Value(1),
        opacityAnim: new Animated.Value(0) // Opacité initialisée à 0
      };
    });

    setAnswerBlocks(blocks);

    // 3. On attend 2 secondes pour laisser le temps au rendu LaTeX
    setTimeout(() => {
      
      // 4. On fait apparaître la question ET les réponses en même temps
      Animated.parallel([
        // Fondu de la question
        Animated.timing(questionOpacityAnim, {
          toValue: 1,
          duration: 500, // Durée du fondu
          useNativeDriver: true,
        }),
        // Fondu des réponses, avec un léger décalage entre chaque
        Animated.stagger(100, 
          blocks.map(block => 
            Animated.timing(block.opacityAnim, {
              toValue: 1, // Rendre visible
              duration: 400,
              useNativeDriver: false,
            })
          )
        )
      ]).start(() => {
        // La manche devient jouable SEULEMENT après l'apparition
        setIsRoundActive(true);
      });

      // 5. On démarre le mouvement des blocs en même temps que leur apparition
      blocks.forEach(block => {
        const totalDistance = block.animX._value + RECT_WIDTH;
        Animated.timing(block.animX, {
          toValue: -RECT_WIDTH,
          duration: totalDistance / BLOCK_SPEED * 1000,
          useNativeDriver: false,
          easing: Easing.linear
        }).start();
      });

    }, 2000); // <-- VOTRE DÉLAI DE MASQUAGE DE 2 SECONDES

  }, [currentQuestionIndex, currentView]);
  useEffect(() => {
    if (currentView !== 'game') return;

    const loop = setInterval(() => {
      if (!isRoundActiveRef.current) return;

      // --- collisions personnage / blocs ---
      const pB = { x: playerX, y: playerY._value, w: FRAME_WIDTH, h: FRAME_HEIGHT };
      answerBlocks.forEach(b => {
        if (b.isHit) return;
        const bB = { x: b.animX._value, y: b.animY._value, w: RECT_WIDTH, h: RECT_HEIGHT };
        if (pB.x < bB.x + bB.w && pB.x + pB.w > bB.x && pB.y < bB.y + bB.h && pB.y + pB.h > bB.y)
          handleAnswerCollision(b);
      });

      // --- collisions projectiles / blocs ---
      projectiles.forEach(p => {
        const pB = { x: p.x, y: p.anim._value, w: 40, h: 40 };
        answerBlocks.forEach(b => {
          if (b.isHit) return;
          const bB = { x: b.animX._value, y: b.animY._value, w: RECT_WIDTH, h: RECT_HEIGHT };
          if (pB.x < bB.x + bB.w && pB.x + pB.w > bB.x && pB.y < bB.y + bB.h && pB.y + pB.h > bB.y) {
            setTimeout(() => {
              handleAnswerCollision(b);
              setProjectiles(prev => prev.filter(pr => pr.id !== p.id));
            }, 0);
          }
        });
      });
      setProjectiles(prev => prev.filter(pr => !pr.isHit));

      // --- nouvelle vérification : tous les blocs sont-ils sortis à gauche ? ---
      if (answerBlocks.length > 0) {
        const allOffScreen = answerBlocks.every(block => block.animX._value < -RECT_WIDTH);
        if (allOffScreen) handleMissedQuestion();
      }
    }, 100);      // Boucle allégée (100 ms)

    return () => clearInterval(loop);
  }, [currentView, answerBlocks, projectiles, lives, currentQuestionIndex]);
  useEffect(() => { const i = setInterval(() => { if (currentView === 'game' && moveDirection === 'left') setPlayerX(x => Math.max(x - 10, 0)); else if (currentView === 'game' && moveDirection === 'right') setPlayerX(x => Math.min(x + 10, screen.width - FRAME_WIDTH)); }, 16); return () => clearInterval(i); }, [moveDirection, screen.width, currentView]);
  useEffect(() => { if (animationIntervalRef.current) clearInterval(animationIntervalRef.current); if (moveDirection) { runSound.current?.replayAsync(); animationIntervalRef.current = setInterval(() => { setFrameIndex(p => { if (moveDirection === 'right') return RUN_RIGHT_START_INDEX + ((p - RUN_RIGHT_START_INDEX + 1) % RUN_RIGHT_FRAME_COUNT); if (moveDirection === 'left') return RUN_LEFT_START_INDEX + ((p - RUN_LEFT_START_INDEX + 1) % RUN_LEFT_FRAME_COUNT); return IDLE_FRAME_INDEX; }); }, ANIMATION_SPEED); } else { runSound.current?.stopAsync(); setFrameIndex(IDLE_FRAME_INDEX); } return () => { if (animationIntervalRef.current) clearInterval(animationIntervalRef.current); }; }, [moveDirection]);
  useEffect(() => { const i = setInterval(() => { setSkyOffset(o => (o - 1) <= -screen.width ? 0 : o - 1); }, 30); return () => clearInterval(i); }, [screen.width]);

  // Décrémenter le compte-à-rebours quand l'essai est actif
  useEffect(() => {
    if (!onTrial) return;

    const timer = setInterval(() => {
      setTrialTimeLeft(prev => {
        const next = prev - 1000;
        if (next <= 0) {
          clearInterval(timer);
          // Fin de l'essai – on affiche l'écran de licence
          setOnTrial(false);
          setIsLicensed(false);
          setShowLicenseScreen(true);
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTrial]);

  const handleEndGame = () => { const max = currentQuestions.length * 10; const grade = max > 0 ? (score / max) * 20 : 0; saveGameResult(userName, { chapter: selectedChapter, date: new Date().toISOString(), score, maxScore: max, grade, missedQuestions }); };
  const handleAnswerCollision = (block) => {
    // 1. Vérifier si la manche est active et si le bloc n'a pas déjà été traité
    if (!isRoundActiveRef.current || (block.isHit && !block.isTimeout)) {
      return;
    }

    // 2. "Verrouiller" la manche pour éviter d'autres collisions
    isRoundActiveRef.current = false;
    setIsRoundActive(false);
    Speech.stop();

    // Arrêter l'animation des blocs uniquement si ce n'est pas un timeout
    if (!block.isTimeout) {
      block.isHit = true;
      answerBlocks.forEach(b => b.animX.stopAnimation());
    }

    // 3. Afficher le feedback visuel et sonore
    const positiveFeedback = ['Bravo !', 'Très bien !', 'Super !', 'Bonne réponse !'];
    const feedbackText = block.isTimeout
      ? 'Trop lent !'
      : (block.isCorrect ? positiveFeedback[Math.floor(Math.random() * positiveFeedback.length)] : 'Incorrect');
    
    const feedbackColor = block.isCorrect ? '#2e7d32' : '#c62828';
    
    const newText = {
      id: Date.now() + Math.random(), text: feedbackText, color: feedbackColor,
      x: block.animX._value, y: block.animY._value, anim: new Animated.Value(0),
    };
    setFloatingTexts(currentTexts => [...currentTexts, newText]);
    Animated.timing(newText.anim, { toValue: 1, duration: 2000, useNativeDriver: true }).start(() => {
      setFloatingTexts(currentTexts => currentTexts.filter(t => t.id !== newText.id));
    });

    if (block.isCorrect) {
      correctSound.current?.replayAsync();
      setScore(s => s + 10);
      if (block.scaleAnim) {
        Animated.sequence([
          Animated.timing(block.scaleAnim, { toValue: 1.2, duration: 200, useNativeDriver: false }),
          Animated.timing(block.scaleAnim, { toValue: 1, duration: 200, useNativeDriver: false })
        ]).start();
      }
    } else {
      wrongSound.current?.replayAsync();
      // On met à jour les questions manquées en utilisant l'index de la question actuelle
      setCurrentQuestionIndex(prevIndex => {
        setMissedQuestions(p => [...p, currentQuestions[prevIndex]]);
        return prevIndex; // Important: on ne change pas l'index ici, on le fait plus tard
      });
    }

    // 4. Planifier la suite (prochaine question ou fin du jeu) après un court délai
    setTimeout(() => {
      // On utilise la forme fonctionnelle de setLives pour garantir d'avoir la dernière valeur
      setLives(prevLives => {
        // On ne perd une vie que si la réponse est incorrecte ou si le temps est écoulé
        const newLives = block.isCorrect ? prevLives : prevLives - 1;

        if (newLives <= 0) {
          handleEndGame();
          setCurrentView('game_over');
          return 0; // On met à jour les vies à 0 et on arrête
        }

        // S'il reste des vies, on passe à la suite
        setCurrentQuestionIndex(prevIndex => {
          if (prevIndex === currentQuestions.length - 1) {
            handleEndGame();
            setCurrentView('chapter_complete');
            return prevIndex; // On reste sur le dernier index
          } else {
            return prevIndex + 1; // On passe à la question suivante
          }
        });

        return newLives; // On met à jour le nouvel état des vies
      });
    }, 1500);
  };

  // --- NOUVELLE FONCTION : gère une question manquée ---
  const handleMissedQuestion = () => {
    if (!isRoundActiveRef.current) return;   // manche déjà terminée

    isRoundActiveRef.current = false;
    setIsRoundActive(false);

    Speech.stop();
    wrongSound.current?.replayAsync();

    // Message flottant
    const newText = {
      id: Date.now() + Math.random(),
      text: 'Manqué !',
      color: '#fbc02d',
      x: screen.width / 2,
      y: screen.height / 3,
      anim: new Animated.Value(0),
    };
    setFloatingTexts(t => [...t, newText]);
    Animated.timing(newText.anim, { toValue: 1, duration: 2000, useNativeDriver: true })
            .start(() => setFloatingTexts(t => t.filter(ft => ft.id !== newText.id)));

    setMissedQuestions(p => [...p, currentQuestions[currentQuestionIndex]]);
    const newLives = lives - 1;
    setLives(newLives);

    setTimeout(() => {
      if (newLives <= 0) { handleEndGame(); setCurrentView('game_over'); return; }
      if (currentQuestionIndex === currentQuestions.length - 1) {
        handleEndGame(); setCurrentView('chapter_complete');
      } else {
        setCurrentQuestionIndex(i => i + 1);
      }
    }, 1500);
  };

  const jump = () => { if(isJumping || currentView !== 'game') return; jumpSound.current?.replayAsync(); setIsJumping(true); Animated.sequence([ Animated.timing(playerY,{toValue: groundY - 150, duration: JUMP_DURATION, useNativeDriver: false, easing: Easing.out(Easing.quad)}), Animated.timing(playerY,{toValue: groundY, duration: JUMP_DURATION, useNativeDriver: false, easing: Easing.in(Easing.quad)}) ]).start(()=>setIsJumping(false)); };
  const handlePower = () => { if (currentView !== 'game' || projectiles.length > 2) return; laserSound.current?.replayAsync(); const startX = playerX + FRAME_WIDTH / 2 - 20; const startY = playerY._value + FRAME_HEIGHT / 2; const id = Date.now() + Math.random(); const animValue = new Animated.Value(startY); const newProjectile = { id, x: startX, anim: animValue }; setProjectiles(p => [...p, newProjectile]); Animated.timing(animValue, { toValue: -50, duration: 800, useNativeDriver: false, easing: Easing.linear }).start(() => { setProjectiles(p => p.filter(pr => pr.id !== id)); }); };
  const repeatQuestion = () => Speech.speak(currentQuestions[currentQuestionIndex]?.texteOral || currentQuestions[currentQuestionIndex]?.question, { language: 'fr-FR' });
  const panResponder = useRef(PanResponder.create({ onStartShouldSetPanResponder: () => currentView === 'game', onPanResponderGrant: (e, g) => { if (g.x0 > screen.width / 2) setMoveDirection('right'); else setMoveDirection('left'); }, onPanResponderMove: (e, g) => { if (g.moveX > screen.width / 2 + 20) setMoveDirection('right'); else if (g.moveX < screen.width / 2 - 20) setMoveDirection('left'); else setMoveDirection(null);}, onPanResponderRelease: (e, g) => { if (Math.abs(g.dx)<20 && g.dy<-30) jump(); setMoveDirection(null); } })).current;
  const handleReturnToMenu = () => { Speech.stop(); setSelectedChapter(null); setShowBilan(false); setCurrentView('menu'); };
  const handleSelectUser = async(n)=>{await AsyncStorage.setItem('CURRENT_USER',n);setUserName(n);setCurrentView('menu');};
  const handleAddUser = async(n)=>{const l=[...userList,n];await AsyncStorage.setItem('USERS_LIST',JSON.stringify(l));setUserList(l);handleSelectUser(n);};
  const handleChangeUser = async()=>{await AsyncStorage.removeItem('CURRENT_USER');setUserName(null);setCurrentView('user_select');};

  // Rejouer uniquement les questions ratées
  const handleReplayMistakes = () => {
    if (missedQuestions.length === 0) return;
    // Prépare une nouvelle série de questions basée sur les erreurs
    const remediations = shuffleArray(missedQuestions).map(q => ({
      ...q,
      allAnswers: shuffleArray([q.correct, ...(q.wrongs || [])])
    }));

    setCurrentQuestions(remediations);
    setCurrentQuestionIndex(0);
    setScore(0);
    setLives(7);
    setMissedQuestions([]);
    setCurrentView('game');
  };

  const renderContent = () => {
      switch (currentView) {
          case 'splash':
            const spin = rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '5deg']
            });
            const shimmerTranslate = shimmerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
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
                    <Text style={styles.splashCreditsText}>Développé par NANOU Aboya Guy</Text>
                    <Text style={styles.splashCreditsText}>Version 1.0</Text>
                  </Animated.View>
                </Animated.View>
              </Animated.View>
            );
          case 'user_select': return <UserSelectScreen users={userList} onSelectUser={handleSelectUser} onAddUser={handleAddUser} />;
          case 'profile': return <ProfileScreen userName={userName} onBack={() => setCurrentView('menu')} />;
          case 'menu': return (<View style={styles.menuContainer}><View style={styles.menuHeaderRow}><TouchableOpacity style={styles.changeUserButtonAbsolute} onPress={handleChangeUser}><Text style={styles.changeUserButtonText}>Changer</Text></TouchableOpacity><Text style={[styles.menuTitle,{fontSize:32,marginBottom:10}]}>Choisis un chapitre</Text></View><TouchableOpacity style={styles.profileButton} onPress={()=>setCurrentView('profile')}><Text style={styles.profileButtonText}>📊 Mon Profil</Text></TouchableOpacity><FlatList data={chapterNames} renderItem={({item})=><TouchableOpacity style={styles.chapterButton} onPress={()=>setSelectedChapter(item)}><Text style={styles.chapterButtonText}>{item}</Text></TouchableOpacity>} keyExtractor={item=>item}/><Text style={styles.currentUserText}>Joueur: <Text style={{fontWeight:'bold'}}>{userName}</Text></Text></View>);
          case 'game_over': case 'chapter_complete': const isW=currentView==='chapter_complete',mS=currentQuestions.length*10,fG=mS>0?(score/mS)*20:0,cE=missedQuestions[currentBilanIndex];if(showBilan&&cE){return(<View style={styles.bilanContainer}><Text style={styles.bilanTitle}>Bilan des erreurs</Text><Text style={styles.bilanCounterText}>{currentBilanIndex+1}/{missedQuestions.length}</Text><View style={styles.bilanContentWrapper}><View style={styles.bilanQuestionSection}><Text style={styles.bilanQuestionLabel}>Question:</Text><View style={styles.bilanQuestionContent}><MathRenderer math={cE.question} color="black" style={{ flexWrap: 'wrap' }}/></View></View><View style={styles.bilanAnswerSection}><Text style={styles.bilanAnswerLabel}>Réponse Correcte:</Text><View style={styles.bilanAnswerContent}><MathRenderer math={cE.correct} color="green" style={{ flexWrap: 'wrap' }}/></View></View></View><View style={styles.bilanNavigation}><TouchableOpacity onPress={()=>setCurrentBilanIndex(i=>i-1)} disabled={currentBilanIndex===0} style={[styles.bilanNavButton,currentBilanIndex===0&&styles.disabledButton]}><Text style={styles.bilanNavButtonText}>Précédent</Text></TouchableOpacity><TouchableOpacity style={styles.bilanNavButton} onPress={()=>setShowBilan(false)}><Text style={styles.bilanNavButtonText}>Retour</Text></TouchableOpacity><TouchableOpacity onPress={()=>setCurrentBilanIndex(i=>i+1)} disabled={currentBilanIndex>=missedQuestions.length-1} style={[styles.bilanNavButton,currentBilanIndex>=missedQuestions.length-1&&styles.disabledButton]}><Text style={styles.bilanNavButtonText}>Suivant</Text></TouchableOpacity></View></View>);} return(<View style={styles.gameOverContainer}><Text style={[styles.gameOverTitle,{color:isW?'#1976d2':'#c62828'}]}>{isW?"Chapitre Terminé !":"Game Over"}</Text><Text style={styles.finalScoreTextSmall}>Score: {score}/{mS}</Text><Text style={styles.finalScoreTextSmall}>Note finale: {Math.ceil(fG)}/20</Text>{missedQuestions.length>0&&<TouchableOpacity style={styles.bilanButton} onPress={()=>{setShowBilan(true);setCurrentBilanIndex(0);}}><Text style={styles.bilanButtonText}>Voir mes erreurs</Text></TouchableOpacity>}<TouchableOpacity style={styles.restartButton} onPress={handleRestart}><Text style={styles.restartButtonText}>Rejouer</Text></TouchableOpacity><TouchableOpacity style={styles.backButton} onPress={handleReturnToMenu}><Text style={styles.backButtonText}>Retour au menu</Text></TouchableOpacity></View>);
          case 'game':
            return (
              <View style={{ flex: 1 }} {...panResponder.panHandlers}>
                <ImageBackground source={bgsta} style={{ flex: 1 }} resizeMode="cover">
                  <Animated.Image source={sky1} style={{ position: 'absolute', width: screen.width * 2, height: screen.height, left: skyOffset }} resizeMode="cover" />
                  
                  <View style={styles.container}>
                    {/* Interface utilisateur en haut */}
                    <View style={styles.uiContainer}>
                      <Text style={styles.scoreText}>Score: {score}</Text>
                      <Text style={styles.livesText}>Vies: {lives} ❤️</Text>
                      
                      {/* La question, maintenant avec animation d'opacité */}
                      <Animated.View style={[styles.questionContainer, { opacity: questionOpacityAnim }]}>
                        <MathRenderer key={`q-${currentQuestionIndex}`} math={currentQuestions[currentQuestionIndex]?.question || ''} fontSize={getFontSizeForQuestion(currentQuestions[currentQuestionIndex]?.question) * 0.6} color="#333" />
                      </Animated.View>
                      
                      <TouchableOpacity onPress={repeatQuestion} style={styles.iconButton}><Text style={styles.menuButtonText}>🔊</Text></TouchableOpacity>
                      <TouchableOpacity onPress={handleReturnToMenu} style={styles.iconButton}><Text style={styles.menuButtonText}>Menu</Text></TouchableOpacity>
                    </View>

                    {/* Blocs de réponse */}
                    {answerBlocks.map((b) => (
                      <Animated.View
                        key={b.id}
                        style={[
                          styles.rect,
                          {
                            left: b.animX,
                            top: b.animY,
                            backgroundColor: b.isHit ? (b.isCorrect ? '#4CAF50' : '#F44336') : '#ff7043',
                            transform: [{ scale: b.scaleAnim }],
                            opacity: b.opacityAnim, // Opacité animée
                          },
                        ]}
                      >
                        <MathRenderer math={b.text} color="white" fontSize={getFontSizeForAnswer(b.text)} style={{ flexWrap: 'wrap' }} />
                      </Animated.View>
                    ))}

                    {/* AJOUTEZ CE BLOC DE CODE ICI */}
                    {projectiles.map(p => (
                      <Animated.Image
                        key={p.id}
                        source={fireballImage}
                        style={{
                          position: 'absolute',
                          left: p.x,
                          top: p.anim, // p.anim est la valeur Y animée
                          width: 40,
                          height: 40,
                          zIndex: 15
                        }}
                        resizeMode="contain"
                      />
                    ))}
                    {/* FIN DU BLOC À AJOUTER */}

                    {/* Textes flottants (Bravo, Incorrect, etc.) */}
                    {floatingTexts.map((ft) => {
                      const translateY = ft.anim.interpolate({ inputRange: [0, 1], outputRange: [0, -80] });
                      const opacity = ft.anim.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });
                      return (
                        <Animated.Text key={ft.id} style={[styles.floatingText, { left: ft.x, top: ft.y, color: ft.color, opacity: opacity, transform: [{ translateY }] }]}>
                          {ft.text}
                        </Animated.Text>
                      );
                    })}

                    {/* Personnage */}
                    <Animated.View style={{ position: 'absolute', left: playerX, top: playerY, width: FRAME_WIDTH, height: FRAME_HEIGHT, overflow: 'hidden', zIndex: 10 }}>
                      <Image source={zadiSprite} style={{ width: FRAME_WIDTH * TOTAL_SPRITE_FRAMES, height: FRAME_HEIGHT, transform: [{ translateX: -frameIndex * FRAME_WIDTH }] }} resizeMode="stretch" />
                    </Animated.View>

                    {/* Sol et Contrôles */}
                    <View style={[styles.ground, { width: screen.width, height: GROUND_HEIGHT, bottom: 0 }]} />
                    <View style={styles.controlsContainer} pointerEvents="box-none">
                      {currentQuestions[currentQuestionIndex]?.imgKey && questionImages[currentQuestions[currentQuestionIndex].imgKey] && (
                        <Image source={questionImages[currentQuestionIndex].imgKey} style={styles.questionImage} resizeMode="contain" />
                      )}
                      <TouchableOpacity style={styles.controlButton} onPressIn={() => setMoveDirection('left')} onPressOut={() => setMoveDirection(null)}>
                        <Text style={styles.controlButtonText}>{'◀'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.controlButton, { backgroundColor: '#e53935' }]} onPress={handlePower}>
                        <Text style={styles.controlButtonText} >🔥</Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity style={[styles.controlButton, styles.jumpButton]} onPress={jump}>
                        <Text style={styles.controlButtonText}>{'▲'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.controlButton} onPressIn={() => setMoveDirection('right')} onPressOut={() => setMoveDirection(null)}>
                        <Text style={styles.controlButtonText}>{'▶'}</Text>
                      </TouchableOpacity>
                    </View>

                  </View>
                </ImageBackground>
              </View>
            );
          default: return <Text>Erreur: Vue inconnue</Text>;
      }
  };

  if (showLicenseScreen) {
    return <LicenseScreen onLicenseValidated={() => {
      setIsLicensed(true);
      setShowLicenseScreen(false);
      // After validation, navigate to the appropriate screen (menu or user_select)
      // based on whether a user is already selected.
      AsyncStorage.getItem('CURRENT_USER').then(storedUser => {
        setCurrentView(storedUser ? 'menu' : 'user_select');
      });
    }} />;
  }

  if (!isLicensed) {
    return <LicenseScreen onLicenseValidated={() => {
      setIsLicensed(true);
      setShowLicenseScreen(false);
      AsyncStorage.getItem('CURRENT_USER').then(storedUser => {
        setCurrentView(storedUser ? 'menu' : 'user_select');
      });
    }} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#03A6A1' }}>
      {renderContent()}

      {/* Affichage du compte-à-rebours de la période d'essai */}
      {onTrial && trialTimeLeft > 0 && (
        <View style={styles.trialTimerContainer}>
          <Text style={styles.trialTimerText}>⏳ Essai : {formatTime(trialTimeLeft)}</Text>
        </View>
      )}
    </View>
  );
}

// Remplacez l'ancien chartConfig par celui-ci
const chartConfig = {
    backgroundColor: '#0D47A1', // Un bleu très foncé
    backgroundGradientFrom: '#0D47A1', // Début du dégradé
    backgroundGradientTo: '#1976D2', // Fin du dégradé vers un bleu plus clair
    decimalPlaces: 0, // <--- CHANGEZ LA VALEUR À 0
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Texte en blanc
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Étiquettes en blanc
    style: { borderRadius: 16 },
    propsForDots: { 
        r: '6', 
        strokeWidth: '2', 
        stroke: '#1976D2' // Contour des points assorti au fond
    }
};

// --- Dimensions et Styles ---
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// --- STYLES ---
const styles = StyleSheet.create({
  // Styles pour la gestion des utilisateurs et le profil
  userSelectContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03A6A1', padding: 20 },
  userInput: { width: '80%', height: 50, backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 15, fontSize: 18, marginBottom: 20, textAlign: 'center' },
  userButton: { backgroundColor: 'rgba(11, 133, 70, 0.9)', borderRadius: 25, paddingVertical: 15, paddingHorizontal: 30, marginVertical: 10, width: '80%', alignItems: 'center' },
  userButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  switchUserText: { color: 'white', marginTop: 20, fontStyle: 'italic' },
  currentUserText: { marginTop: 12, color: '#fff', fontStyle: 'italic', fontSize: 16 },
  profileButton: {
    backgroundColor: '#d214a7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 0,
    width: '17%', // Réduction de la largeur
    alignSelf: 'center', // Centrage horizontal
    alignItems: 'center',
  },
  profileButtonText: {
    color: '#fff',
    fontSize: 14, // Réduction de la taille du texte
    fontWeight: '600',
  },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  profileContainer: { flexGrow: 1, alignItems: 'center', padding: 20 },
  profileTitle: { fontSize: 32, fontWeight: 'bold', color: '#005a9c', marginBottom: 20 },
  profileInfoText: { fontSize: 18, color: '#37474f', marginVertical: 5 },
  statsContainer: { width: '100%', backgroundColor: 'rgba(255,255,255,0.8)', padding: 15, borderRadius: 10, marginBottom: 20 },
  statsTitle: { fontSize: 22, fontWeight: 'bold', color: '#00796b', marginBottom: 10 },
  pickerContainer: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10, backgroundColor: '#fff' },
  picker: { height: 50, width: '100%' },
  bestScoreItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  bestScoreChapter: { fontSize: 16, color: '#333', flex: 1 },
  bestScoreValue: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  historyItem: { backgroundColor: '#fafafa', padding: 15, borderRadius: 6, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  historyDate: { fontSize: 12, color: '#777', marginBottom: 5 },
  historyChapter: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  historyScore: { fontSize: 14, color: '#444' },
  missedSection: { marginTop: 10, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 10 },
  missedQuestionBox: { marginBottom: 8, padding: 5, backgroundColor: '#fff9f9', borderRadius: 4 },
  noDataText: { fontStyle: 'italic', color: '#888', textAlign: 'center', paddingVertical: 10 },
  errorText: { textAlign: 'center', color: 'red', fontSize: 16 },
  
  // Styles du menu principal
  menuContainer: { flex: 1, backgroundColor: 'rgb(255, 255, 255)', paddingTop: 10, paddingHorizontal: 20 },
  menuTitle: { fontSize: 42, fontWeight: '900', color: 'rgb(8, 106, 67)', marginBottom: 40, textAlign: 'center', textShadowColor: 'rgba(11, 45, 72, 0)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2, letterSpacing: 3 },
  chapterButton: { backgroundColor: 'rgba(11, 133, 70, 0.9)', borderRadius: 40, paddingVertical: 10, paddingHorizontal: 20, marginVertical: 5, width: '97%', justifyContent: 'center', alignItems: 'center', elevation: 12, borderWidth: 2, borderColor: 'rgb(255, 255, 255)' },
  chapterButtonText: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 22, fontWeight: 'bold', textAlign: 'center', textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3, letterSpacing: 1 },
  
  // Styles généraux et du jeu
  container: { flex: 1 },
  uiContainer: { position: 'absolute', top: 10, width: '100%', paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 },
  scoreText: { fontSize: 20, fontWeight: 'bold', color: '#00796b' },
  iconButton: { padding: 8 },
  menuButtonText: { color: '#00796b', fontWeight: 'bold', fontSize: 18 },
  questionContainer: { flex: 1, minHeight: 80, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },
  rect: { 
    position: 'absolute', 
    width: RECT_WIDTH, 
    minWidth: RECT_WIDTH, 
    paddingHorizontal: 10, 
    paddingVertical: 10,
    height: RECT_HEIGHT, 
    backgroundColor: '#ff7043', 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden'
  },
  ground: { position: 'absolute', left: 0, backgroundColor: '#388e3c', zIndex: 1 },
  controlsContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', padding: 20, alignItems: 'center', zIndex: 20 },
  controlButton: { backgroundColor: '#fff', borderRadius: 40, width: 80, height: 80, justifyContent: 'center', alignItems: 'center', elevation: 4, borderWidth: 2, borderColor: '#1976d2', opacity: 0.6 },
  controlButtonText: { fontSize: 32, color: '#1976d2', fontWeight: 'bold' },
  jumpButton: { backgroundColor: '#FFD600', borderWidth: 0 },
  livesText: { fontSize: 20, fontWeight: 'bold', color: '#d32f2f', marginLeft: 15 },
  floatingText: { // Style pour le texte flottant
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 20
  },
  
 // Styles des écrans de fin et bilan
 gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fafafa', padding: 20 },
 gameOverTitle: { fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
 finalScoreTextSmall: { fontSize: 18, color: '#37474f', marginBottom: 8 },
 restartButton: { backgroundColor: '#2e7d32', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 15 },
 restartButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
 questionImage: { position: 'absolute', bottom: 120, left: 35, width: 167, height: 167, borderRadius: 8, zIndex: 3, borderWidth: 3, borderColor: '#4CAF50' },
 splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 splashImage: { position: 'absolute', width: '100%', height: '100%' },
 splashOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.12)', justifyContent: 'center', alignItems: 'center' },
 splashTitle: { fontSize: 60, fontWeight: '900', color: '#fff', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 3, height: 3 }, textShadowRadius: 8 },
 splashSlogan: { fontSize: 18, color: '#FFD600', fontStyle: 'italic' },
 splashSubtitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textShadowColor: 'rgba(0,0,0,0.8)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 6, marginBottom: 10 },
 splashLevel: { fontSize: 16, color: '#fff', fontStyle: 'italic', marginBottom: 20 },
 splashCredits: { position: 'absolute', bottom: 20, alignItems: 'center' },
 splashCreditsText: { fontSize: 12, color: '#fff', opacity: 0.7 },
 bilanButton: { backgroundColor: '#ff9800', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 15, elevation: 4 },
 bilanButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
 bilanContainer: { flex: 1, backgroundColor: '#f7f9fc', padding: 10, justifyContent: 'center' },
 bilanContentWrapper: { flexDirection: 'column', width: '100%' },
 bilanTitle: { fontSize: 28, fontWeight: 'bold', color: '#005a9c', textAlign: 'center', marginVertical: 10 },
 bilanQuestionSection: { minHeight: 100, marginBottom: 10 },
 bilanQuestionLabel: { fontSize: 15, fontWeight: 'bold', color: '#c62828', marginBottom: 8 },
 bilanQuestionContent: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', padding: 15, borderRadius: 8, justifyContent: 'center', flexWrap: 'wrap', minHeight: 80 },
 bilanAnswerSection: { minHeight: 100, marginBottom: 10 },
 bilanAnswerLabel: { fontSize: 15, fontWeight: 'bold', color: '#2e7d32', marginBottom: 8 },
 bilanAnswerContent: { flex: 1, backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#c8e6c9', padding: 15, borderRadius: 8, justifyContent: 'center', flexWrap: 'wrap', minHeight: 80 },
 bilanNavigation: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, marginTop: 5, width: '100%' },
 bilanNavButton: { backgroundColor: '#1976d2', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
 bilanNavButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
 disabledButton: { backgroundColor: '#bdbdbd' },
 bilanCounterText: { fontSize: 18, fontWeight: 'bold', color: '#37474f', textAlign: 'center', marginBottom: 5 },
 backButton: { backgroundColor: '#757575', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, alignSelf: 'center', elevation: 2, marginTop: 10 },
 backButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
 changeUserButtonAbsolute: { position: 'absolute', left: 15, top: 15, backgroundColor: '#e53935', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, zIndex: 2 },
 changeUserButtonText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
 menuHeaderRow: { width: '100%', alignItems: 'center', justifyContent: 'center', padding: 10, position: 'relative' },

  // Nouveaux styles pour le tableau
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f4f6f8',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 2,
    borderColor: '#dfe6e9',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0D47A1',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Permet aux cellules de s'étendre verticalement
    paddingHorizontal: 5,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#eef2f5',
  },
  tableCell: {
    fontSize: 14,
    color: '#2d3436',
    justifyContent: 'center',
    flexShrink: 1,
    flexWrap: 'wrap', // autorise le texte/MathRenderer à passer à la ligne
  },
  tableCellFailures: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    color: '#c62828',
  },
  replayButton: { backgroundColor: '#e53935', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginTop: 15 },
  replayButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Styles pour le timer d'essai
  trialTimerContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 200,
  },
  trialTimerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  // Bouton TEST LICENCE
  resetLicenseButton: { backgroundColor: '#c62828', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20, marginVertical: 10, width: '40%', alignSelf: 'center', alignItems: 'center' },
  resetLicenseButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
});

// ---------------------------------------------------------
//  FONCTION DEBUG : réinitialise essai + licence
// ---------------------------------------------------------
const resetTrialAndLicense = async () => {
  try {
    await SecureStore.deleteItemAsync('app_license_key');
    await SecureStore.deleteItemAsync('trial_start_date');
    setOnTrial(false);
    setIsLicensed(false);
    setShowLicenseScreen(true);
  } catch (e) {
    console.warn('Erreur reset licence:', e);
  }
};



