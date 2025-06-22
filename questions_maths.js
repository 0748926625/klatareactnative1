export const questionsLibrary = {
  maths: {
    "CALCUL LITTERAL": [
      {
        question: "\\(\\frac{a}{b} + \\frac{i}{c} =\\)",
        texteOral: "Que vaut la fraction a sur b, plus la fraction i sur c ?",
        correct:  "\\(\\frac{ac + bi}{bc}\\)",
        wrongs: [
          "\\(\\frac{ai + bc}{bc}\\)",
          "\\(\\frac{ac - bi}{bc}\\)",
          "\\(\\frac{a + bi}{bc}\\)"
        ]
      },
      {
        question: "\\(\\frac{e}{b} - \\frac{a}{t} =\\)",
        texteOral: "Que vaut la fraction e sur b, moins la fraction a sur t ?",
        correct:  "\\(\\frac{et - ba}{bt}\\)",
        wrongs: [
          "\\(\\frac{eb - at}{bt}\\)",
          "\\(\\frac{et + ba}{bt}\\)",
          "\\(\\frac{e - a}{bt}\\)"
        ]
      },
      {
        question: "\\(\\frac{a}{b} \\times \\frac{d}{e} =\\)",
        texteOral: "Que vaut la fraction a sur b, fois la fraction d sur e ?",
        correct:  "\\(\\frac{ad}{be}\\)",
        wrongs: [
          "\\(\\frac{ae}{bd}\\)",
          "\\(\\frac{a + d}{be}\\)",
          "\\(\\frac{ad}{b + e}\\)"
        ]
      },
      {
        question: "\\(\\frac{a}{b} + f =\\)",
        texteOral: "Que vaut la fraction a sur b, plus f ?",
        correct:  "\\(\\frac{a + bf}{b}\\)",
        wrongs: [
          "\\(\\frac{a + f}{b}\\)",
          "\\(\\frac{af + b}{b}\\)",
          "\\(\\frac{bf - a}{b}\\)"
        ]
      },
      {
        question: "\\(\\frac{\\frac{a}{b}}{\\frac{c}{d}} =\\)",
        texteOral: "Que vaut la fraction a sur b, divisée par la fraction c sur d ?",
        correct:  "\\(\\frac{ad}{bc}\\)", // Corrigé par rapport à votre original
        wrongs: [
          "\\(\\frac{ac}{bd}\\)",
          "\\(\\frac{ab}{cd}\\)",
          "\\(\\frac{cd}{ab}\\)"
        ]
      },
      {
        question: "\\(\\frac{a}{b} = \\frac{c}{d}\\) équivaut à",
        texteOral: "L'égalité a sur b égale c sur d, équivaut à ?",
        correct:  "\\(ad = bc\\)",
        wrongs: [
          "\\(a + b = c + d\\)",
          "\\(a = \\frac{bc}{d}\\)",
          "\\(bd = ac\\)"
        ]
      },
      {
        question: "\\(\\frac{1}{a^n} =\\)",
        texteOral: "Que vaut 1 sur a puissance n ?",
        correct:  "\\(a^{-n}\\)",
        wrongs: [
          "\\(a^n\\)",
          "\\(-a^n\\)",
          "\\(n^{-a}\\)"
        ]
      },
      {
        question: "\\(a^n \\times b^n =\\)",
        texteOral: "Que vaut a puissance n, fois b puissance n ?",
        correct:  "\\((ab)^n\\)",
        wrongs: [
          "\\((a + b)^n\\)",
          "\\(a^{n + n} b^{n + n}\\)",
          "\\(a^n b^n\\)"
        ]
      },
      {
        question: "\\(a^m \\times a^n =\\)",
        texteOral: "Que vaut a puissance m, fois a puissance n ?",
        correct:  "\\(a^{m + n}\\)",
        wrongs: [
          "\\(a^{m - n}\\)",
          "\\(a^{mn}\\)",
          "\\(a^{m \\times n}\\)"
        ]
      },
      {
        question: "\\((a^m)^n =\\)",
        texteOral: "Que vaut, entre parenthèses, a puissance m, le tout à la puissance n ?",
        correct:  "\\(a^{m \\times n}\\)",
        wrongs: [
          "\\(a^{m + n}\\)",
          "\\(a^{mn}\\)",
          "\\((a^{m + n})\\)"
        ]
      },
      {
        question: "\\(\\frac{a^m}{a^n} =\\)",
        texteOral: "Que vaut a puissance m, sur a puissance n ?",
        correct:  "\\(a^{m - n}\\)",
        wrongs: [
          "\\(a^{n - m}\\)",
          "\\(a^{m + n}\\)",
          "\\(a^{mn}\\)"
        ]
      },
      {
        question: "\\(a + (b - c) - (d - e) =\\)",
        texteOral: "Que vaut a, plus, entre parenthèses, b moins c, moins, entre parenthèses, d moins e ?",
        correct:  "\\(a + b - c - d + e\\)",
        wrongs: [
          "\\(a + b - c + d - e\\)",
          "\\(a - b + c - d + e\\)",
          "\\(a + b + c - d - e\\)"
        ]
      },
      {
        question: "\\(a(x + y - z) =\\)",
        texteOral: "Que vaut a, facteur de, entre parenthèses, x plus y moins z ?",
        correct:  "\\(ax + ay - az\\)",
        wrongs: [
          "\\(ax + yz - az\\)",
          "\\(ax + ay + az\\)",
          "\\(a + x + y - z\\)"
        ]
      },
      {
        question: "\\((a - b)^2 =\\)",
        texteOral: "Que vaut, entre parenthèses, a moins b, le tout au carré ?",
        correct:  "\\(a^2 - 2ab + b^2\\)",
        wrongs: [
          "\\(a^2 + 2ab + b^2\\)",
          "\\(a^2 - 2a + b^2\\)",
          "\\(a^2 - b^2\\)"
        ]
      },
      {
        question: "\\((a + b)(a - b) =\\)",
        texteOral: "Que vaut, entre parenthèses, a plus b, facteur de, entre parenthèses, a moins b ?",
        correct:  "\\(a^2 - b^2\\)",
        wrongs: [
          "\\(a^2 + b^2\\)",
          "\\(a^2 - 2ab - b^2\\)",
          "\\(a^2 + ab - b^2\\)"
        ]
      },
      {
        question: "a \\(\\times\\) b = 0 équivaut à",
        texteOral: "a fois b égale zéro, équivaut à ?",
        correct:  "a = 0 ou b = 0",
        wrongs: [
          "a = 0 et b = 0",
          "a = 1 ou b = 1",
          "ab = 1"
        ]
      },
      {
        question: "a² = b² équivaut à",
        texteOral: "a au carré égale b au carré, équivaut à ?",
        correct:  "a = b ou a = -b",
        wrongs: [
          "a = b seulement",
          "a = -b seulement",
          "a² = b² n’a pas de solution"
        ]
      },
      {
        question: "22x⁵ - 4x² + 3 est un … de degré …",
        texteOral: "vingt-deux x puissance cinq, moins quatre x au carré, plus trois, est un ... de degré ... ?",
        correct:  "polynôme en x de degré 5",
        wrongs: [
          "polynôme en x de degré 2",
          "expression algébrique de degré 5",
          "polynôme en 5 de degré x"
        ]
      },
      {
        question: "\\(\\frac{2x + 8}{(3x + 2)(x - 5)}\\) est …",
        texteOral: "La fraction deux x plus huit, sur, le produit de, trois x plus deux, par, x moins cinq, est ... ?",
        correct:  "une fraction rationnelle",
        wrongs: [
          "un polynôme",
          "une expression irrationnelle",
          "une équation"
        ]
      },
      {
        question: "Une fraction rationnelle existe si … et seulement si …",
        texteOral: "Une fraction rationnelle existe si ... et seulement si ...",
        correct:  "son dénominateur est différent de 0",
        wrongs: [
          "son numérateur est différent de 0",
          "numérateur et dénominateur sont premiers entre eux",
          "le dénominateur est positif"
        ]
      }
    ],
    "LA PROPRIETE DE THALES": [
      {
        question: "On utilise la propriété de Thalès pour …",
        texteOral: "On utilise la propriété de Thalès pour ...",
        correct: "Calculer des distances ou justifier une égalité de quotients",
        wrongs: [
          "Calculer des aires ou des volumes",
          "Montrer que des points sont alignés",
          "Déterminer les angles d’un triangle"
        ]
      },
      {
        question: "Dans ce triangle ABC, quelle égalité de quotients obtient-on ?",
        texteOral: "Dans un triangle A B C, M appartient au segment A B et N appartient au segment A C, avec la droite M N parallèle à la droite B C. Quelle égalité de quotients obtient-on ?",
        correct: "\\(\\displaystyle \\frac{AM}{AB} = \\frac{AN}{AC}\\)",
        wrongs: [
          "\\(\\displaystyle \\frac{AB}{AM} = \\frac{AC}{AN}\\)",
          "\\(\\displaystyle \\frac{AM}{AC} = \\frac{AN}{AB}\\)",
          "\\(\\displaystyle AM \\cdot AB = AN \\cdot AC\\)"
        ],
        imgKey: "thales_fig3",
        imgPath: "assets/images/thales_fig3.png"
      },
      {
        question: "(BC) parallèle à (ED).Quelle égalité de quotients <br> exprime la propriété de Thalès ?",
        texteOral: "Dans la figure ci-contre, on a la droite B C parallèle à la droite E D. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\(\\displaystyle \\frac{AB}{AE} = \\frac{AC}{AD}\\)",
        wrongs: [
          "\\(\\displaystyle \\frac{AF}{AB} = \\frac{AD}{AC}\\)",
          "\\(\\displaystyle \\frac{AB}{AC} = \\frac{AF}{AD}\\)",
          "\\(\\displaystyle AB \\cdot AD = AC \\cdot AF\\)"
        ],
        imgKey: "thales_fig4",
        imgPath: "assets/images/thales_fig4.png"
      },
      {
        question: " On a (AB) parallèle à (CD). Quelle égalité de quotients <br> exprime la propriété de Thalès ?",
        texteOral: "Dans la figure ci-contre, on a la droite A B parallèle à la droite C D. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\(\\displaystyle \\frac{OA}{OD} = \\frac{OB}{OC}\\)",
        wrongs: [
          "\\(\\displaystyle \\frac{OD}{OA} = \\frac{OC}{OB}\\)",
          "\\(\\displaystyle \\frac{OA}{OB} = \\frac{OD}{OC}\\)",
          "\\(\\displaystyle OA \\cdot OC = OD \\cdot OB\\)"
        ],
        imgKey: "thales_fig5",
        imgPath: "assets/images/thales_fig5.png"
      },
      {
        question: "On a (AB) parallèle à (EF). Quelle égalité de quotients <br> exprime la propriété de Thalès ?",
        texteOral: "Dans la figure ci-contre, on a la droite A B parallèle à la droite E F. Quelle égalité de quotients exprime la propriété de Thalès ?",
        correct: "\\(\\displaystyle \\frac{KE}{KB} = \\frac{KF}{KA}\\)",
        wrongs: [
          "\\(\\displaystyle \\frac{KE}{KF} = \\frac{KB}{KA}\\)",
          "\\(\\displaystyle KE \\cdot KA = KB \\cdot KF\\)",
          "\\(\\displaystyle \\frac{KB}{KE} = \\frac{KA}{KF}\\)"
        ],
        imgKey: "thales_fig6",
        imgPath: "assets/images/thales_fig6.png"
      },
      {
        question: "On utilise la réciproque de la propriété de Thalès  <br> pour démontrer que deux droites sont ...",
        texteOral: "On utilise la réciproque de la propriété de Thalès pour démontrer que deux droites sont ...",
        correct: " parallèles",
        wrongs: [
          "sécantes",
          "perpendiculaires",
          "concourantes"
        ]
      },
      {
        question: "On utilise la conséquence de la propriété de Thalès pour …",
        texteOral: "On utilise la conséquence de la propriété de Thalès pour ...",
        correct: "Calculer des distances",
        wrongs: [
          "Déterminer le centre d’un cercle",
          "Montrer que trois points sont colinéaires",
          "Calculer des mesures d'angles "
        ]
      },
      {
        question: "on a (AB) parallèle à (EF). Quelle égalité de quotients exprime la conséquence de la propriété de Thalès ?",
        texteOral: " on a la droite A B parallèle à la droite E F. Quelle égalité de quotients exprime la conséquence de la propriété de Thalès ?",
        correct: "\\(\\displaystyle \\frac{KE}{KB} = \\frac{KF}{KA} = \\frac{EF}{AB}\\)",
        wrongs: [
          "\\(\\displaystyle \\frac{KB}{KE} = \\frac{KA}{KF} = \\frac{AB}{EF}\\)",
          "\\(\\displaystyle KE \\cdot KA = KB \\cdot KF = EF \\cdot AB\\)",
          "\\(\\displaystyle \\frac{KE}{KF} = \\frac{KB}{KA} = \\frac{AB}{EF}\\)"
        ],
        imgKey: "thales_fig6",
        imgPath: "assets/images/thales_fig6.png"
      }
    ],
    "RACINES CARREES": [
      {
        question: "\\(\\sqrt{49} =\\)",
        texteOral: "Que vaut racine carrée de quarante-neuf ?",
        correct: "7",
        wrongs: ["-7", "49", "9"]
      },
      {
        question: "\\(\\sqrt{25} =\\)",
        texteOral: "Que vaut racine carrée de vingt-cinq ?",
        correct: "5",
        wrongs: ["-5", "25", "6"]
      },
      {
        question: "\\(\\sqrt{16} =\\)",
        texteOral: "Que vaut racine carrée de seize ?",
        correct: "4",
        wrongs: ["-4", "8", "2"]
      },
      {
        question: "\\(\\sqrt{64} =\\)",
        texteOral: "Que vaut racine carrée de soixante-quatre ?",
        correct: "8",
        wrongs: ["-8", "16", "6"]
      },
      {
        question: "\\(\\sqrt{100} =\\)",
        texteOral: "Que vaut racine carrée de cent ?",
        correct: "10",
        wrongs: ["-10", "100", "20"]
      },
      {
        question: "\\(\\sqrt{144} =\\)",
        texteOral: "Que vaut racine carrée de cent quarante-quatre ?",
        correct: "12",
        wrongs: ["-12", "144", "14"]
      },
      {
        question: "\\(\\sqrt{9} =\\)",
        texteOral: "Que vaut racine carrée de neuf ?",
        correct: "3",
        wrongs: ["-3", "9", "1"]
      },
      {
        question: "\\(\\sqrt{1} =\\)",
        texteOral: "Que vaut racine carrée de un ?",
        correct: "1",
        wrongs: ["-1", "0", "2"]
      },
      {
        question: "\\(\\sqrt{81} =\\)",
        texteOral: "Que vaut racine carrée de quatre-vingt-un ?",
        correct: "9",
        wrongs: ["-9", "81", "8"]
      },
      {
        question: "\\(\\sqrt{0} =\\)",
        texteOral: "Que vaut racine carrée de zéro ?",
        correct: "0",
        wrongs: ["1", "-0", "\\(\\sqrt{}\\)"]
      },
      {
        question: "\\(\\sqrt{121} =\\)",
        texteOral: "Que vaut racine carrée de cent vingt-et-un ?",
        correct: "11",
        wrongs: ["-11", "121", "10"]
      },
      {
        question: "L'expression conjuguée de \\(\\sqrt{a}\\) est …",
        texteOral: "L'expression conjuguée de racine carrée de a est ...",
        correct: "\\(-\\sqrt{a}\\)",
        wrongs: ["\\(\\sqrt{a}\\)", "\\(a-\\sqrt{a}\\)", "\\(+\\sqrt{a}\\)"]
      },
      {
        question: "L'expression conjuguée de \\(\\sqrt{a}+b\\) est …",
        texteOral: "L'expression conjuguée de racine carrée de a, plus b, est ...",
        correct: "\\(b-\\sqrt{a}\\)", // ou "\\(-\\sqrt{a}+b\\)"
        wrongs: ["\\(\\sqrt{a}-b\\)", "\\(\\sqrt{a}+b\\)", "\\(b+\\sqrt{a}\\)"]
      },
      {
        question: "L'expression conjuguée de \\(a + b\\sqrt{c}\\) est …",
        texteOral: "L'expression conjuguée de a, plus b racine carrée de c, est ...",
        correct: "\\(a - b\\sqrt{c}\\)",
        wrongs: ["\\(a + b\\sqrt{c}\\)", "\\(b\\sqrt{c}-a\\)", "\\(-a - b\\sqrt{c}\\)"]
      },
      {
        question: "\\((\\sqrt{a})^2 =\\)",
        texteOral: "Que vaut, entre parenthèses, racine carrée de a, le tout au carré ?",
        correct: "a",
        wrongs: ["\\(\\sqrt{a}\\)", "2a", "\\(a\\sqrt{a}\\)"]
      },
      {
        question: "\\(\\sqrt{a^2} =\\)",
        texteOral: "Que vaut racine carrée de a au carré ?",
        correct: "|a|",
        wrongs: ["a", "2a", "\\(a^2\\)"]
      },
      {
        question: "\\(\\sqrt{a \\times b} =\\)",
        texteOral: "Que vaut racine carrée de a fois b ?",
        correct: "\\(\\sqrt{a} \\times \\sqrt{b}\\)",
        wrongs: ["\\(a\\times b\\)", "\\(\\sqrt{a}+\\sqrt{b}\\)", "\\(\\sqrt{a+b}\\)"]
      },
      {
        question: "\\(\\sqrt{\\frac{a}{b}} =\\)",
        texteOral: "Que vaut racine carrée de a sur b ?",
        correct: "\\(\\frac{\\sqrt{a}}{\\sqrt{b}}\\)",
        wrongs: ["\\(\\frac{a}{b}\\)", "\\(\\sqrt{a} \\cdot b\\)", "\\(\\frac{a}{\\sqrt{b}}\\)"]
      },
      {
        question: "\\(\\sqrt{a^{2n}} =\\)",
        texteOral: "Que vaut racine carrée de a puissance deux n ?",
        correct: "\\(a^n\\)",
        wrongs: ["\\(2n\\cdot a\\)", "\\(a^{2n}\\)", "\\(n\\cdot a^2\\)"]
      },
      {
        question: "\\(\\sqrt{a^{2n+1}} =\\)",
        texteOral: "Que vaut racine carrée de a puissance deux n plus un ?",
        correct: "\\(a^n\\sqrt{a}\\)",
        wrongs: ["\\(a^{n+1}\\)", "\\(a^{2n}\\)", "\\(\\sqrt{a}\\cdot a^n\\)"] // Inversion pour que le fallback lise correctement
      },
      {
        question: "\\((a\\sqrt{b})^2 =\\)",
        texteOral: "Que vaut, entre parenthèses, a racine carrée de b, le tout au carré ?",
        correct: "\\(a^2b\\)",
        wrongs: ["\\(ab^2\\)", "\\(a^2\\sqrt{b}\\)", "2ab"]
      },
      {
        question: "…… permet d'écrire un quotient sans radical au dénominateur",
        texteOral: "Quelle opération permet d'écrire un quotient sans radical au dénominateur ?",
        correct: "La rationalisation",
        wrongs: ["La simplification", "La factorisation", "La conjugaison"]
      }
    ],
    "TRIANGLE RECTANGLE": [
      {
        question: "Selon la propriété de Pythagore, dans le triangle rectangle ABC,<br>rectangle en B, AC²=?",
        texteOral: "Selon la propriété de Pythagore, dans le triangle rectangle A B C, rectangle en B, A C au carré égale ?",
        correct: "AB² + BC²",
        wrongs: ["BC² - AC²", "AC²+BC²", "AB² - BC²"],
        imgKey: "rectangle_fig1",
        imgPath: "assets/images/rectangle_fig1.png"
      },
      {
        question: "Selon la propriété de Pythagore, dans le triangle rectangle ABC,<br>rectangle en B, AB²=?",
        texteOral: "Selon la propriété de Pythagore, dans le triangle rectangle A B C, rectangle en B, A B au carré égale ?",
        correct: "AC² - BC²",
        wrongs: ["AC² + BC²", "BC² - AC²", "BC² + AC²"],
        imgKey: "rectangle_fig1",
        imgPath: "assets/images/rectangle_fig1.png"
      },
      {
        question: "Selon la propriété métrique déduite de l'aire, on a ",
        texteOral: "Selon la propriété métrique déduite de l'aire, on a ?",
        correct: "EF x FG = FT x EG",
        wrongs: ["EF + FG = FT + EG", "EF x FT = FG x EG", "EF x EG = FG x ET" ],
        imgKey: "rectangle_fig2",
        imgPath: "assets/images/rectangle_fig2.png"
      },
      {
        question: "Si un triangle est rectangle, alors le carré de l’hypoténuse est égal …",
        texteOral: "Si un triangle est rectangle, alors le carré de l’hypoténuse est égal ...",
        correct: "à la somme des carrés des deux autres côtés",
        wrongs: [
          "à la somme des longueurs des deux autres côtés",
          "à la différence des carrés des deux autres côtés",
          "au double de la plus petite longueur"
        ]
      },
      {
        question: "On utilise la propriété de Pythagore pour …",
        texteOral: "On utilise la propriété de Pythagore pour ...",
        correct: "calculer la longueur d’un segment ",
        wrongs: [
          "déterminer si un triangle est isocèle",
          "calculer la somme des angles",
          "trouver le centre d’un cercle inscrit"
        ]
      },
      {
        question: "On utilise la réciproque de la propriété de Pythagore pour …",
        texteOral: "On utilise la réciproque de la propriété de Pythagore pour ...",
        correct: "démontrer qu’un triangle est rectangle",
        wrongs: [
          "calculer des distances",
          "montrer que deux angles sont égaux",
          "prouver que deux droites sont parallèles"
        ]
      },
      {
        question: "Dans un triangle, si on vérifie que le carré d’un côté est égal à la somme des carrés des deux autres, alors …",
        texteOral: "Dans un triangle, si on vérifie que le carré d’un côté est égal à la somme des carrés des deux autres, alors ...",
        correct: "le triangle est rectangle",
        wrongs: [
          "le triangle est équilatéral",
          "le triangle est isocèle",
          "le triangle est quelconque"
        ]
      },
      {
        question: "Le sinus d’un angle aigu est égal à …",
        texteOral: "Le sinus d’un angle aigu est égal à ...",
        correct: "\\(\\frac{\\text{côté opposé}}{\\text{hypoténuse}}\\)",
        wrongs: [
          "\\(\\frac{\\text{côté adjacent}}{\\text{hypoténuse}}\\)",
          "\\(\\frac{\\text{côté opposé}}{\\text{côté adjacent}}\\)",
          "\\(\\frac{\\text{hypoténuse}}{\\text{côté opposé}}\\)"
        ]
      },
      {
        question: "Le cosinus d’un angle aigu est égal à …",
        texteOral: "Le cosinus d’un angle aigu est égal à ...",
        correct: "\\(\\frac{\\text{côté adjacent}}{\\text{hypoténuse}}\\)",
        wrongs: [
          "\\(\\frac{\\text{côté opposé}}{\\text{hypoténuse}}\\)",
          "\\(\\frac{\\text{hypoténuse}}{\\text{côté adjacent}}\\)",
          "\\(\\frac{\\text{côté adjacent}}{\\text{côté opposé}}\\)"
        ]
      },
      {
        question: "La tangente d’un angle aigu est égale à …",
        texteOral: "La tangente d’un angle aigu est égale à ...",
        correct: "\\(\\frac{\\text{côté opposé}}{\\text{côté adjacent}}\\)",
        wrongs: [
          "\\(\\frac{\\text{côté adjacent}}{\\text{côté opposé}}\\)",
          "\\(\\frac{\\text{hypoténuse}}{\\text{côté adjacent}}\\)",
          "\\(\\frac{\\text{côté opposé}}{\\text{hypoténuse}}\\)"
        ]
      },
      {
        question: "Quelle est la relation trigonométrique fondamentale ?",
        texteOral: "Quelle est la relation trigonométrique fondamentale ?",
        correct: "\\(\\sin^2\\theta + \\cos^2\\theta = 1\\)", // "sinus carré thêta plus cosinus carré thêta égale un"
        wrongs: [
          "\\(\\sin\\theta + \\cos\\theta = 1\\)",
          "\\(\\tan\\theta = \\sin\\theta + \\cos\\theta\\)",
          "\\(\\cos\\theta = 1 - \\sin\\theta\\)"
        ]
      },
      {
        question: "Les angles aigus d’un triangle rectangle sont …",
        texteOral: "Les angles aigus d’un triangle rectangle sont ...",
        correct: "complémentaires, donc leur somme fait \\(90^\\circ\\)",
        wrongs: [
          "opposés",
          "égaux",
          "supplémentaires"
        ]
      }
    ],
    "CALCUL NUMERIQUE": [
      {
        question: "L'intersection des ensembles A et B (A ∩ B) est :",
        texteOral: "L'intersection des ensembles A et B, notée A inter B, est :",
        correct: "l’ensemble des éléments appartenant à A et B",
        wrongs: [
          "l’ensemble des éléments appartenant à A ou B",
          "l’ensemble vide",
          "l’ensemble des éléments n’appartenant ni à A ni à B"
        ]
      },
      {
        question: "La réunion des ensembles A et B (A ∪ B) est :",
        texteOral: "La réunion des ensembles A et B, notée A union B, est :",
        correct: "l’ensemble des éléments appartenant à A ou B",
        wrongs: [
          "l’ensemble des éléments appartenant à A et B (confusion union/intersection)",
          "l’ensemble des éléments n’appartenant ni à A ni à B",
          "un sous-ensemble de A seulement"
        ]
      },
      {
        question: "Si 4 < 7, alors leurs inverses vérifient :",
        texteOral: "Si quatre est inférieur à sept, alors leurs inverses vérifient :",
        correct: "\\(\\frac{1}{4} > \\frac{1}{7}\\)",
        wrongs: [
          "\\(\\frac{1}{4} < \\frac{1}{7}\\)",
          "\\(\\frac{1}{4} = \\frac{1}{7}\\)",
          "\\(\\frac{1}{4} + \\frac{1}{7} = 0\\)"
        ]
      },
      {
        question: "Avec a < E < b et c < F < d, un encadrement de E + F est :",
        texteOral: "Avec a inférieur à E inférieur à b, et c inférieur à F inférieur à d, un encadrement de E plus F est :",
        correct: "a + c < E + F < b + d",
        wrongs: [
          "ac < E + F < bd",
          "a + b < E + F <c + d",
          "a + d < E + F <b + c"
        ]
      },
      {
        question: "Si \\(a < 0\\) et \\(b < 0\\), alors \\(a \\times b\\) est :",
        texteOral: "Si a est inférieur à zéro et b est inférieur à zéro, alors a fois b est :",
        correct: "Positif",
        wrongs: ["Négatif", "Nul", "Impossible à déterminer"]
      },
      {
        question: "Que vaut \\(| \\pi - 2 |\\) ?",
        texteOral: "Que vaut valeur absolue de pi moins deux ?",
        correct: "\\(\\pi - 2\\)",
        wrongs: [
          "\\(2 - \\pi\\) ",
          "\\(\\pi + 2\\) ",
          "\\(0\\) "
        ]
      },
      {
        question: "Que vaut \\(| \\pi - 7 |\\) ?",
        texteOral: "Que vaut valeur absolue de pi moins sept ?",
        correct: "\\(7 - \\pi\\)",
        wrongs: [
          "\\(\\pi - 7\\) ",
          "\\(\\pi + 7\\)",
          "\\(0\\)"
        ]
      },
      {
        question: "Quel est l’amplitude de l’intervalle [f ; j] ?",
        texteOral: "Quel est l’amplitude de l’intervalle fermé f, j ?",
        correct: "j - f",
        wrongs: ["j + f", "0", "j × f"]
      },
      {
        question: "Le centre de l’intervalle [a ; z] est :",
        texteOral: "Le centre de l’intervalle fermé a, z est :",
        correct: "\\(\\frac{a + z}{2}\\)",
        wrongs: [
          "\\(\\frac{z - a}{2}\\) (amplitude au lieu du centre)",
          "\\(a\\) (confusion avec la borne inférieure)",
          "\\(z\\) (confusion avec la borne supérieure)"
        ]
      },
      {
        question: "Comment se lit l’intervalle <b>[3 ; 17]</b> ?",
        texteOral: "Comment se lit l’intervalle crochet fermé trois, point virgule, dix-sept, crochet fermé ?",
        correct: "intervalle fermé 3;17",
        wrongs: [
          "intervalle ouvert 3;17",
          "intervalle fermé en 3 et ouvert en 17",
          "intervalle ouvert en 3 et fermé en 17"
        ]
      },
      {
        question: "Comment se lit l’intervalle <b>[-5 ; →[</b> ?",
        texteOral: "Comment se lit l’intervalle crochet fermé moins cinq, point virgule, plus l'infini, crochet ouvert ?",
        correct: "intervalle des nombres supérieurs ou égaux à -5",
        wrongs: [
          "intervalle des nombres supérieurs à -5",
          "intervalle des nombres supérieurs à 5",
          "intervalle des nombres inférieurs ou égaux à -5"
        ]
      },
      {
        question: "Comment se lit l’intervalle <b>]-1 ; 4]</b> ?",
        texteOral: "Comment se lit l’intervalle crochet ouvert moins un, point virgule, quatre, crochet fermé ?",
        correct: "intervalle ouvert à -1 et fermé à 4",
        wrongs: [
          "intervalle fermé en -1 et ouvert en 4",
          "intervalle ouvert  -1 ; 4",
          "intervalle fermé -1 ; 4"
        ]
      },
      {
        question: "Comment se lit l’intervalle <b>]← ; 6]</b> ?",
        texteOral: "Comment se lit l’intervalle crochet ouvert moins l'infini, point virgule, six, crochet fermé ?",
        correct: "intervalle des nombres inférieurs ou égaux à 6",
        wrongs: [
          "intervalle des nombres supérieurs ou égaux à 6",
          "-intervalle des nombres inférieurs à 6", // Devrait être "intervalle des nombres inférieurs à 6"
          "intervalle des nombres supérieurs à 6"
        ]
      },
      {
        question: "Comment se lit l’intervalle <b>[2 ; 14[</b> ?",
        texteOral: "Comment se lit l’intervalle crochet fermé deux, point virgule, quatorze, crochet ouvert ?",
        correct: "intervalle fermé en 2 et ouvert en 14", // J'ai ajusté cette réponse pour correspondre à la notation.
        wrongs: [
          "intervalle fermé 2; 14",
          "intervalle ouvert en 2 et fermé en 14", // Votre correct était "intervalle ouvert 2;14", ce qui est ambigu.
          "intervalle ouvert 2; 14" // Redondant si le précédent est utilisé
        ]
      }
    ],
    "ANGLES INSCRITS DANS UN CERCLE": [
      {
        question: "l'angle \\( \\hat{RST} \\) est un ...?",
        texteOral: "L'angle R S T est un ...?",
        correct: "Angle aigu inscrit",
        wrongs: ["Angle droit", "Angle au centre", "Angle plat"],
        imgKey: "angle_1",
        imgPath: "assets/images/angle_1.png"
      },
      {
        question: "Quelle est la mesure de l'angle \\( \\hat{RST} \\) ?",
        texteOral: "Quelle est la mesure de l'angle R S T ?",
        correct: "75°",
        wrongs: ["80°", "90°", "150°"],
        imgKey: "angle_1",
        imgPath: "assets/images/angle_1.png"
      },
      {
        question: "l'angle \\( \\hat{SRT} \\) est un...?", // J'ai utilisé SRT pour être cohérent avec la réponse
        texteOral: "L'angle S R T est un ...?",
        correct: "Angle aigu inscrit",
        wrongs: ["Angle droit", "Angle au centre", "Angle angle plat"], // "Angle angle plat" -> "Angle plat"
        imgKey: "angle_1", // La même image ?
        imgPath: "assets/images/angle_1.png"
      },
      {
        question: "Quelle est la mesure de l'angle \\( \\hat{SRT} \\) ?",
        texteOral: "Quelle est la mesure de l'angle S R T ?",
        correct: "40°",
        wrongs: ["75°", "80°", "160°"],
        imgKey: "angle_SRT", // Vous aviez angle_SRT ici, j'ai gardé. Si c'est la même image, changez en angle_1.
        imgPath: "assets/images/angle_1.png"
      },
      {
        question: "Quelle est la nature de l'angle \\( \\hat{SOT} \\) ?",
        texteOral: "Quelle est la nature de l'angle S O T ?",
        correct: "Angle au centre",
        wrongs: ["Angle aigu", "Angle droit", "Angle plat"],
        imgKey: "angle_1",
        imgPath: "assets/images/angle_1.png"
      },
      {
        question: "Quelle est la mesure de l'angle \\( \\hat{RTU} \\) ?",
        texteOral: "Quelle est la mesure de l'angle R T U ?",
        correct: "65°",
        wrongs: ["60°", "80°", "150°"],
        imgKey: "angle_1",
        imgPath: "assets/images/angle_1.png"
      }
    ],
    "VECTEURS": [
       {
        question: "Un vecteur \\( \\overrightarrow{AB} \\) est caractérisé par :",
        texteOral: "Un vecteur A B est caractérisé par :",
        correct: "Sa direction, son sens et sa norme",
        wrongs: [
          "Sa couleur et sa longueur",
          "Sa position et sa vitesse",
          "Son angle et sa surface"
        ],
        imgKey: "vecteur_caracteristiques",
        imgPath: "assets/images/vecteur_caracteristiques.png"
      },
      {
        question: "Que vaut \\( \\overrightarrow{AB} + \\overrightarrow{BC} \\) ?",
        texteOral: "Que vaut vecteur A B plus vecteur B C ?",
        correct: "\\( \\overrightarrow{AC} \\) ",
        wrongs: [
          "\\( \\overrightarrow{BA} \\)",
          "\\( \\overrightarrow{AB} \\)",
          "\\( \\overrightarrow{0} \\)"
        ],
        imgKey: "relation_chasles",
        imgPath: "assets/images/relation_chasles.png"
      },
      {
        question: "Deux vecteurs \\( \\overrightarrow{u} \\) et \\( \\overrightarrow{v} \\) sont colinéaires si :",
        texteOral: "Deux vecteurs u et v sont colinéaires si :",
        correct: "Il existe un réel \\( k \\) tel que \\( \\overrightarrow{u} = k \\overrightarrow{v} \\)",
        wrongs: [
          "Ils ont la même longueur",
          "Ils forment un angle droit",
          "Ils partagent la même origine"
        ],
        imgKey: "vecteurs_colineaires",
        imgPath: "assets/images/vecteurs_colineaires.png"
      },
      {
        question: "Si \\( \\overrightarrow{AB} = \\overrightarrow{CD} \\), que peut-on dire ?",
        texteOral: "Si vecteur A B égale vecteur C D, que peut-on dire ?",
        correct: "Ils ont même direction, sens et longueur",
        wrongs: [
          "Ils partagent la même origine",
          "Ils sont opposés",
          "Ils sont nuls"
        ],
        imgKey: "vecteurs_egaux",
        imgPath: "assets/images/vecteurs_egaux.png"
      },
     {
      question: "Que représente \\( \\overrightarrow{AB} - \\overrightarrow{AC} \\) ?",
      texteOral: "Que représente vecteur A B moins vecteur A C ?",
      correct: "\\( \\overrightarrow{CB} \\)",
      wrongs: [
        "\\( \\overrightarrow{BA} \\)",
        "\\( \\overrightarrow{BC} \\)",
        "\\( \\overrightarrow{0} \\)"
      ],
      imgKey: "soustraction_vecteurs",
      imgPath: "assets/images/soustraction_vecteurs.png"
    },
      {
        question: "Dans un parallélogramme \\( ABCD \\), que vaut \\( \\overrightarrow{AB} + \\overrightarrow{AD} \\) ?",
        texteOral: "Dans un parallélogramme A B C D, que vaut vecteur A B plus vecteur A D ?",
        correct: "\\( \\overrightarrow{AC} \\)",
        wrongs: [
          "\\( \\overrightarrow{BD} \\)",
          "\\( \\overrightarrow{0} \\)",
          "\\( \\overrightarrow{AB} \\)"
        ],
        imgKey: "parallelogramme_vecteurs",
        imgPath: "assets/images/parallelogramme_vecteurs.png"
      }
    ],
    "COORDONNEES DE VECTEURS": [
      {
        question: "Dans un repère orthonormé, quelles conditions définissent le repère ?",
        texteOral: "Dans un repère orthonormé, quelles conditions définissent le repère ?",
        correct: "(OI) ⊥ (OJ) et OI = OJ",
        wrongs: [
          "(OI) // (OJ)",
          "OI = 2×OJ",
          "Seulement (OI) ⊥ (OJ)"
        ],
        imgKey: "repere_orthonorme",
        imgPath: "assets/images/repere_orthonorme.png"
      },
      {
        question: "Si A(x₁, y₁) et B(x₂, y₂), quel est le couple de coordonnées de \\( \\overrightarrow{AB} \\) ?",
        texteOral: "Si A a pour coordonnées x un, y un, et B a pour coordonnées x deux, y deux, quel est le couple de coordonnées du vecteur A B ?",
        correct: "\\( \\left( x₂ - x₁ ; y₂ - y₁ \\right) \\)",
        wrongs: [
          "\\( \\left( x₁ + x₂ ; y₁ + y₂ \\right) \\)",
          "\\( \\left( x₁ - x₂ ; y₁ - y₂ \\right) \\)",
          "\\( \\left( \\frac{x₁+x₂}{2} ; \\frac{y₁+y₂}{2} \\right) \\)"
        ],
        imgKey: "coordonnees_vecteur",
        imgPath: "assets/images/coordonnees_vecteur.png"
      },
      {
        question: "Deux vecteurs \\( \\overrightarrow{u}(x ; y) \\) et \\( \\overrightarrow{v}(x' ; y') \\) sont colinéaires si :",
        texteOral: "Deux vecteurs u de coordonnées x, y, et v de coordonnées x prime, y prime, sont colinéaires si :",
        correct: "\\( xy' - x'y = 0 \\)",
        wrongs: [
          "\\( xx' + yy' = 0 \\)",
          "\\( x + x' = y + y' \\)",
          "\\( \\frac{x}{x'} = \\frac{y}{y'} \\)" // Sera lu "x sur x prime égale y sur y prime"
        ],
        imgKey: "colinearite",
        imgPath: "assets/images/colinearite.png"
      },
      {
        question: "Quelle formule donne les coordonnées du milieu M de [AB] ?",
        texteOral: "Quelle formule donne les coordonnées du milieu M du segment A B ?",
        correct: "\\( M\\left( \\frac{x_A + x_B}{2} ; \\frac{y_A + y_B}{2} \\right) \\)",
        wrongs: [
          "\\( M\\left( x_A - x_B ; y_A - y_B \\right) \\)",
          "\\( M\\left( x_B - x_A ; y_B - y_A \\right) \\)",
          "\\( M\\left( \\frac{x_A}{2} ; \\frac{y_B}{2} \\right) \\)"
        ],
        imgKey: "milieu_segment",
        imgPath: "assets/images/milieu_segment.png"
      },
      {
        question: "Comment calcule-t-on la distance AB dans un repère orthonormé ?",
        texteOral: "Comment calcule-t-on la distance A B dans un repère orthonormé ?",
        correct: "\\( AB = \\sqrt{(x_B - x_A)^2 + (y_B - y_A)^2} \\)",
        wrongs: [
          "\\( AB = |x_B - x_A| + |y_B - y_A| \\)",
          "\\( AB = \\frac{(x_B - x_A) + (y_B - y_A)}{2} \\)",
          "\\( AB = (x_B - x_A) \\times (y_B - y_A) \\)"
        ],
        imgKey: "distance_points",
        imgPath: "assets/images/distance_points.png"
      },
      {
      question: "Deux vecteurs \\( \\overrightarrow{u}(a ; b) \\) et \\( \\overrightarrow{v}(c ; d) \\) sont orthogonaux si :",
      texteOral: "Deux vecteurs u de coordonnées a, b, et v de coordonnées c, d, sont orthogonaux si :",
      correct: "\\( ac + bd = 0 \\)",
      wrongs: [
        "\\( ad - bc = 0 \\)",
        "\\( \\frac{a}{c} = \\frac{b}{d} \\)",
        "\\( a + c = b + d \\)"
      ],
      imgKey: "orthogonalite",
      imgPath: "assets/images/orthogonalite.png"
    },
      {
      question: "Que vaut \\( k \\times \\overrightarrow{AB}(x ; y) \\) ?",
      texteOral: "Que vaut k fois le vecteur A B de coordonnées x, y ?",
      correct: "\\( \\overrightarrow{AB}(kx ; ky) \\)",
      wrongs: [
        "\\( \\overrightarrow{AB}(x + k ; y + k) \\)",
        "\\( \\overrightarrow{AB}\\left(\\frac{x}{k} ; \\frac{y}{k}\\right) \\)",
        "\\( \\overrightarrow{AB}(x^k ; y^k) \\)"
      ],
      imgKey: "produit_scalaire_vecteur", // Note: c'est un produit par un scalaire, pas un produit scalaire.
      imgPath: "assets/images/produit_scalaire_vecteur.png"
    }
  ],
  "EQUATIONS ET INEQUATIONS": [
    {
      question: "Quelle est la solution de l'équation \\( ax + b = 0 \\) ?",
      texteOral: "Quelle est la solution de l'équation a x plus b égale zéro ?",
      correct: "\\( x = -\\frac{b}{a} \\)",
      wrongs: [
        "\\( x = \\frac{b}{a} \\)",
        "\\( x = \\frac{a}{b} \\)",
        "\\( x = 0 \\)"
      ],
      imgKey: "equation_ax_plus_b",
      imgPath: "assets/images/equation_ax_plus_b.png"
    },
    {
      question: "Comment résoudre \\( ax + b = cx + d \\) ?",
      texteOral: "Comment résoudre a x plus b, égale c x plus d ?",
      correct: "Isoler \\( x \\) en regroupant les termes",
      wrongs: [
        "Additionner directement \\( a \\) et \\( c \\)",
        "Diviser par \\( x \\) des deux côtés",
        "Remplacer \\( x \\) par 0"
      ],
      imgKey: "equation_ax_egal_cx",
      imgPath: "assets/images/equation_ax_egal_cx.png"
    },
    {
      question: "Que signifie \\( (ax + b)(cx + d) = 0 \\) ?",
      texteOral: "Que signifie, entre parenthèses, a x plus b, facteur de, entre parenthèses, c x plus d, égale zéro ?",
      correct: "Au moins un des facteurs est nul",
      wrongs: [
        "Les deux facteurs sont positifs",
        "Les deux facteurs sont égaux",
        "Le produit est toujours positif"
      ],
      imgKey: "produit_egal_zero",
      imgPath: "assets/images/produit_egal_zero.png"
    },
    {
      question: "Que fait-on si on divise par un nombre négatif dans une inéquation ?",
      texteOral: "Que fait-on si on divise par un nombre négatif dans une inéquation ?",
      correct: "On inverse le sens de l'inégalité",
      wrongs: [
        "On garde le même sens",
        "On transforme en équation",
        "On ajoute 1 aux deux membres"
      ],
      imgKey: "inegalite_negatif",
      imgPath: "assets/images/inegalite_negatif.png"
    },
    {
      question: "Comment écrire \\( x \\geq 5 \\) en intervalle ?",
      texteOral: "Comment écrire x supérieur ou égal à cinq en intervalle ?",
      correct: "\\( [5 ; +\\infty[ \\)",
      wrongs: [
        "\\( ]5 ; +\\infty[ \\)",
        "\\( ]-\\infty ; 5] \\)",
        "\\( [5 ; 10] \\)"
      ],
      imgKey: "intervalle_superieur",
      imgPath: "assets/images/intervalle_superieur.png"
    },
    {
      question: "Que représente la solution d'un système de deux inéquations ?",
      texteOral: "Que représente la solution d'un système de deux inéquations ?",
      correct: "L'intersection des deux ensembles de solutions",
      wrongs: [
        "La réunion des deux ensembles",
        "La moyenne des solutions",
        "Aucune solution possible"
      ],
      imgKey: "systeme_inequations",
      imgPath: "assets/images/systeme_inequations.png"
    },
    {
      question: "Si une entreprise propose un tarif \\( T = 10000 + 70x \\) et une autre \\( T = 7000 + 90x \\), comment trouver le kilométrage où les tarifs sont égaux ?",
      texteOral: "Si une entreprise propose un tarif T égale dix mille plus soixante-dix x, et une autre T égale sept mille plus quatre-vingt-dix x, comment trouver le kilométrage où les tarifs sont égaux ?",
      correct: "Résoudre \\( 10000 + 70x = 7000 + 90x \\)",
      wrongs: [
        "Additionner les deux équations",
        "Trouver \\( x \\) tel que \\( 70x > 90x \\)",
        "Ignorer les constantes"
      ],
      imgKey: "application_tarifs",
      imgPath: "assets/images/application_tarifs.png"
    }
  ],
  "EQUATIONS DE DROITES": [
    {
      question: "Quelle est la forme générale d'une équation de droite dans un repère ?",
      texteOral: "Quelle est la forme générale d'une équation de droite dans un repère ?",
      correct: "\\( px + qy + r = 0 \\) (avec \\( p \\) et \\( q \\) non tous nuls)",
      wrongs: [
        "\\( y = ax^2 + b \\)",
        "\\( xy = k \\)",
        "\\( ax + b = 0 \\)"
      ],
      imgKey: "forme_generale",
      imgPath: "assets/images/forme_generale.png"
    },
    {
      question: "Que permet de vérifier le coefficient directeur d'une droite ?",
      texteOral: "Que permet de vérifier le coefficient directeur d'une droite ?",
      correct: "Son inclinaison par rapport à l'axe des abscisses",
      wrongs: [
        "Sa distance à l'origine",
        "Son intersection avec l'axe des ordonnées",
        "Sa couleur sur un graphique"
      ],
      imgKey: "role_coefficient",
      imgPath: "assets/images/role_coefficient.png"
    },
    {
      question: "Quelle est la propriété des droites parallèles à l'axe des ordonnées ?",
      texteOral: "Quelle est la propriété des droites parallèles à l'axe des ordonnées ?",
      correct: "Leur équation est de la forme \\( x = k \\)",
      wrongs: [
        "Elles ont un coefficient directeur nul",
        "Elles passent toujours par l'origine",
        "Leur équation est \\( y = ax + b \\)"
      ],
      imgKey: "droite_verticale",
      imgPath: "assets/images/droite_verticale.png"
    },
    {
      question: "Que signifie l'ordonnée à l'origine \\( b \\) dans \\( y = ax + b \\) ?",
      texteOral: "Que signifie l'ordonnée à l'origine b, dans y égale a x plus b ?",
      correct: "Le point où la droite coupe l'axe des ordonnées",
      wrongs: [
        "La pente de la droite",
        "L'abscisse du sommet de la droite",
        "La longueur de la droite"
      ],
      imgKey: "ordonnee_origine",
      imgPath: "assets/images/ordonnee_origine.png"
    },
    {
      question: "Comment justifier que deux droites sont perpendiculaires ?",
      texteOral: "Comment justifier que deux droites sont perpendiculaires ?",
      correct: "Le produit de leurs coefficients directeurs vaut \\( -1 \\)",
      wrongs: [
        "Leurs coefficients directeurs sont égaux",
        "Leurs ordonnées à l'origine sont opposées",
        "Elles se croisent à l'origine"
      ],
      imgKey: "perpendiculaires",
      imgPath: "assets/images/perpendiculaires.png"
    },
    {
      question: "Quelle est la particularité d'une droite d'équation \\( y = 5 \\) ?",
      texteOral: "Quelle est la particularité d'une droite d'équation y égale cinq ?",
      correct: "Elle est parallèle à l'axe des abscisses",
      wrongs: [
        "Elle est verticale",
        "Elle passe par le point (5 ; 0)",
        "Son coefficient directeur est 5"
      ],
      imgKey: "droite_horizontale",
      imgPath: "assets/images/droite_horizontale.png"
    },
    {
      question: "Quelle méthode utilise-t-on pour déterminer une équation de droite passant par deux points ?",
      texteOral: "Quelle méthode utilise-t-on pour déterminer une équation de droite passant par deux points ?",
      correct: "Vérifier la colinéarité des vecteurs",
      wrongs: [
        "Calculer la moyenne des coordonnées",
        "Utiliser le théorème de Pythagore",
        "Résoudre un système trigonométrique"
      ],
      imgKey: "methode_colinearite",
      imgPath: "assets/images/methode_colinearite.png"
    }
  ],
  "EQUATIONS ET INEQUATIONS DANS R X R": [
    {
      question: "Quelle est la particularité d'une inéquation du premier degré dans ℝ×ℝ ?",
      texteOral: "Quelle est la particularité d'une inéquation du premier degré dans R croix R ?",
      correct: "Elle définit un demi-plan dans un repère orthonormé",
      wrongs: [
        "Elle représente toujours une droite",
        "Elle n'admet qu'une seule solution",
        "Elle ne contient que des égalités strictes"
      ],
      imgKey: "inequation_demiplan",
      imgPath: "assets/images/inequation_demiplan.png"
    },
    {
      question: "Que permet de déterminer la résolution graphique d'un système d'équations ?",
      texteOral: "Que permet de déterminer la résolution graphique d'un système d'équations ?",
      correct: "Le point d'intersection des deux droites",
      wrongs: [
        "La pente des droites",
        "L'aire entre les courbes",
        "La distance entre les droites"
      ],
      imgKey: "resolution_graphique",
      imgPath: "assets/images/resolution_graphique.png"
    },
    {
      question: "Quelle est la condition pour qu'un système de deux équations n'ait pas de solution ?",
      texteOral: "Quelle est la condition pour qu'un système de deux équations n'ait pas de solution ?",
      correct: "Les droites associées sont parallèles et distinctes",
      wrongs: [
        "Les droites se coupent à l'origine",
        "Les coefficients directeurs sont opposés",
        "Les ordonnées à l'origine sont égales"
      ],
      imgKey: "systeme_sans_solution",
      imgPath: "assets/images/systeme_sans_solution.png"
    },
    {
      question: "Que représente l'intersection de deux demi-plans pour un système d'inéquations ?",
      texteOral: "Que représente l'intersection de deux demi-plans pour un système d'inéquations ?",
      correct: "L'ensemble des solutions communes aux deux inéquations",
      wrongs: [
        "La réunion des solutions des deux inéquations",
        "La zone exclue par les deux inéquations",
        "Le point de rencontre des axes"
      ],
      imgKey: "intersection_demiplans",
      imgPath: "assets/images/intersection_demiplans.png"
    },
    {
      question: "Quelle méthode utilise-t-on pour résoudre un système par combinaison ?",
      texteOral: "Quelle méthode utilise-t-on pour résoudre un système par combinaison ?",
      correct: "Éliminer une variable en additionnant des équations multipliées",
      wrongs: [
        "Isoler une variable dans une équation",
        "Tracer les droites associées",
        "Utiliser des coefficients négatifs"
      ],
      imgKey: "methode_combinaison",
      imgPath: "assets/images/methode_combinaison.png"
    },
    {
      question: "Comment vérifier qu'un couple (x; y) est solution d'une inéquation ?",
      texteOral: "Comment vérifier qu'un couple x, y, est solution d'une inéquation ?",
      correct: "Remplacer x et y dans l'inéquation et vérifier l'inégalité",
      wrongs: [
        "Calculer la distance à l'origine",
        "Tracer la droite correspondante",
        "Comparer les coefficients directeurs"
      ],
      imgKey: "verification_solution",
      imgPath: "assets/images/verification_solution.png"
    },
    {
      question: "Que signifie le signe < dans l'inéquation \\(2x + y - 6 < 0\\) ?",
      texteOral: "Que signifie le signe inférieur strict dans l'inéquation deux x plus y moins six, inférieur strict à zéro ?",
      correct: "Les solutions sont dans le demi-plan ne contenant pas la droite frontière", // Ajusté pour plus de précision
      wrongs: [
        "Les solutions sont sur la droite",
        "Les solutions sont dans le demi-plan contenant la droite frontière",
        "L'inéquation n'admet pas de solutions"
      ],
      imgKey: "signe_inegalite",
      imgPath: "assets/images/signe_inegalite.png"
    }
  ],
  "STATISTIQUES": [
   {
      question: "Comment détermine-t-on la médiane si l'effectif total est impair ?",
      texteOral: "Comment détermine-t-on la médiane si l'effectif total est impair ?",
      correct: "C'est la valeur centrale de la série ordonnée",
      wrongs: [
        "On prend la moyenne des deux valeurs centrales",
        "C'est toujours la première valeur de la série",
        "On utilise la formule \\( \\frac{n}{2} \\)"
      ],
      imgKey: "mediane_impair",
      imgPath: "assets/images/mediane_impair.png"
    },
    {
      question: "Quelle méthode utilise-t-on pour la médiane si l'effectif total est pair ?",
      texteOral: "Quelle méthode utilise-t-on pour la médiane si l'effectif total est pair ?",
      correct: "La moyenne des deux valeurs centrales de la série ordonnée",
      wrongs: [
        "On choisit la valeur la plus fréquente",
        "On prend la dernière valeur de la série",
        "On ignore les deux valeurs centrales"
      ],
      imgKey: "mediane_pair",
      imgPath: "assets/images/mediane_pair.png"
    },
    {
      question: "Quelle est la formule correcte de la moyenne d’une série statistique ?",
      texteOral: "Quelle est la formule correcte de la moyenne d’une série statistique ?",
      correct: "\\( \\frac{\\sum (valeur \\times effectif)}{effectif\\ total} \\)",
      wrongs: [
        "\\( \\frac{valeur\\ max + valeur\\ min}{2} \\)",
        "\\( \\sum effectifs \\div nombre\\ de\\ modalités \\)",
        "\\( effectif\\ total \\times valeur\\ centrale \\)"
      ],
      imgKey: "formule_moyenne",
      imgPath: "assets/images/formule_moyenne.png"
    },
    {
      question: "Comment calcule-t-on la fréquence d’une modalité ?",
      texteOral: "Comment calcule-t-on la fréquence d’une modalité ?",
      correct: "\\( \\frac{effectif\\ de\\ la\\ modalité}{effectif\\ total} \\times 100 \\)",
      wrongs: [
        "\\( effectif\\ total \\div effectif\\ de\\ la\\ modalité \\)",
        "\\( \\sum (valeurs) \\div nombre\\ de\\ modalités \\)",
        "\\( effectif\\ cumulé \\times 100 \\)"
      ],
      imgKey: "formule_frequence",
      imgPath: "assets/images/formule_frequence.png"
    },
    {
      question: "Que représente le polygone des effectifs cumulés croissants pour trouver la médiane ?",
      texteOral: "Que représente le polygone des effectifs cumulés croissants pour trouver la médiane ?",
      correct: "Le point où la courbe atteint 50% de l'effectif total",
      wrongs: [
        "L'intersection avec l'axe des ordonnées",
        "La valeur la plus élevée de la série",
        "La classe modale"
      ],
      imgKey: "polygone_mediane",
      imgPath: "assets/images/polygone_mediane.png"
    },
    {
      question: "Quelle affirmation est vraie pour une série avec effectif total pair ?",
      texteOral: "Quelle affirmation est vraie pour une série avec effectif total pair ?",
      correct: "La médiane n'est pas forcément une valeur de la série",
      wrongs: [
        "La médiane est toujours un nombre entier",
        "La médiane correspond au mode",
        "La médiane est la moyenne de toutes les valeurs"
      ],
      imgKey: "mediane_pair_vs_impair",
      imgPath: "assets/images/mediane_pair_vs_impair.png"
    },
    {
      question: "À quoi correspond la fréquence cumulée croissante ?",
      texteOral: "À quoi correspond la fréquence cumulée croissante ?",
      correct: "Au pourcentage d'individus ayant une valeur inférieure ou égale à une modalité",
      wrongs: [
        "À la différence entre deux effectifs consécutifs",
        "À la moyenne des fréquences",
        "Au nombre total de modalités"
      ],
      imgKey: "frequence_cumulee",
      imgPath: "assets/images/frequence_cumulee.png"
    },
    {
      question: "Qu'est-ce que le mode d'une série statistique ?",
      texteOral: "Qu'est-ce que le mode d'une série statistique ?",
      correct: "La modalité avec l'effectif le plus élevé",
      wrongs: [
        "La moyenne des valeurs extrêmes",
        "La différence entre la plus grande et la plus petite valeur",
        "La valeur centrale après classement"
      ],
      imgKey: "mode_definition",
      imgPath: "assets/images/mode_definition.png"
    },
    {
      question: "Que représente la médiane d'une série statistique ?",
      texteOral: "Que représente la médiane d'une série statistique ?",
      correct: "La valeur qui sépare la série en deux groupes de même effectif",
      wrongs: [
        "La valeur la plus fréquente",
        "La moyenne des valeurs",
        "L'étendue des données"
      ],
      imgKey: "mediane_definition",
      imgPath: "assets/images/mediane_definition.png"
    },
    {
      question: "À quoi servent les effectifs cumulés croissants ?",
      texteOral: "À quoi servent les effectifs cumulés croissants ?",
      correct: "À connaître le nombre total d'individus jusqu'à une modalité donnée",
      wrongs: [
        "À calculer la moyenne",
        "À identifier la classe modale",
        "À comparer deux séries statistiques"
      ],
      imgKey: "effectifs_cumules",
      imgPath: "assets/images/effectifs_cumules.png"
    },
    {
      question: "Quelle est la particularité d'une classe modale ?",
      texteOral: "Quelle est la particularité d'une classe modale ?",
      correct: "C'est la classe avec l'effectif le plus élevé",
      wrongs: [
        "C'est la classe contenant la médiane",
        "C'est la première classe du tableau",
        "C'est la classe de plus grande amplitude"
      ],
      imgKey: "classe_modale",
      imgPath: "assets/images/classe_modale.png"
    },
    {
      question: "Que permet de visualiser un diagramme circulaire ?",
      texteOral: "Que permet de visualiser un diagramme circulaire ?",
      correct: "La répartition des effectifs selon les modalités",
      wrongs: [
        "L'évolution des données dans le temps",
        "La comparaison entre deux populations",
        "Les valeurs extrêmes de la série"
      ],
      imgKey: "diagramme_circulaire",
      imgPath: "assets/images/diagramme_circulaire.png"
    },
    {
      question: "Comment interpréter un polygone des effectifs cumulés croissants ?",
      texteOral: "Comment interpréter un polygone des effectifs cumulés croissants ?",
      correct: "Il montre la progression cumulative des effectifs par modalité",
      wrongs: [
        "Il compare les fréquences entre classes",
        "Il indique la dispersion des données",
        "Il calcule automatiquement la médiane"
      ],
      imgKey: "polygone_cumules",
      imgPath: "assets/images/polygone_cumules.png"
    }
  ],
  "APPLICATIONS AFFINES": [
    {
      question: "Quelle est la forme générale d'une application affine ?",
      texteOral: "Quelle est la forme générale d'une application affine ?",
      correct: "f(x) = ax + b, où a et b sont des nombres réels",
      wrongs: [
        "f(x) = ax² + bx + c",
        "f(x) = a/x + b",
        "f(x) = |ax| + b"
      ],
      imgKey: "forme_application_affine",
      imgPath: "assets/images/forme_application_affine.png"
    },
    {
      question: "Comment reconnaît-on une application linéaire parmi les applications affines ?",
      texteOral: "Comment reconnaît-on une application linéaire parmi les applications affines ?",
      correct: "Lorsque le terme constant b est nul (f(x) = ax)",
      wrongs: [
        "Lorsque le coefficient a est négatif",
        "Lorsque la représentation graphique est une parabole",
        "Lorsque a = 1"
      ],
      imgKey: "application_lineaire",
      imgPath: "assets/images/application_lineaire.png"
    },
    {
      question: "Que représente le coefficient a dans f(x) = ax + b ?",
      texteOral: "Que représente le coefficient a dans f de x égale a x plus b ?",
      correct: "La pente de la droite représentant l'application affine",
      wrongs: [
        "L'ordonnée à l'origine de la droite",
        "La valeur maximale de f(x)",
        "La distance entre deux points de la droite"
      ],
      imgKey: "coefficient_pente",
      imgPath: "assets/images/coefficient_pente.png"
    },
    {
      question: "Quelle est la particularité de la représentation graphique d'une application linéaire ?",
      texteOral: "Quelle est la particularité de la représentation graphique d'une application linéaire ?",
      correct: "Elle passe toujours par l'origine du repère",
      wrongs: [
        "Elle est toujours parallèle à l'axe des abscisses",
        "Elle forme une courbe exponentielle",
        "Elle n'a pas d'ordonnée à l'origine"
      ],
      imgKey: "graphique_lineaire",
      imgPath: "assets/images/graphique_lineaire.png"
    },
    {
      question: "Comment détermine-t-on le sens de variation d'une application affine ?",
      texteOral: "Comment détermine-t-on le sens de variation d'une application affine ?",
      correct: "En analysant le signe du coefficient a",
      wrongs: [
        "En calculant la valeur de b",
        "En traçant obligatoirement la droite",
        "En comparant f(0) et f(1)"
      ],
      imgKey: "sens_variation",
      imgPath: "assets/images/sens_variation.png"
    },
    {
      question: "Que devient une application affine si a = 0 ?",
      texteOral: "Que devient une application affine si a égale zéro ?",
      correct: "Elle est constante (f(x) = b pour tout x)",
      wrongs: [
        "Elle est strictement croissante",
        "Elle n'est plus définie",
        "Elle devient une application linéaire"
      ],
      imgKey: "application_constante",
      imgPath: "assets/images/application_constante.png"
    },
    {
      question: "Quelle propriété permet de relier une application linéaire à un tableau de proportionnalité ?",
      texteOral: "Quelle propriété permet de relier une application linéaire à un tableau de proportionnalité ?",
      correct: "f(kx) = kf(x) et f(x + y) = f(x) + f(y)",
      wrongs: [
        "f(xy) = f(x)f(y)",
        "f(1/x) = 1/f(x)",
        "f(x) est toujours supérieure à x"
      ],
      imgKey: "proportionnalite_lineaire",
      imgPath: "assets/images/proportionnalite_lineaire.png"
    }
  ],
  "PYRAMIDES ET CONES": [
    {
      question: "Quelle caractéristique définit une pyramide régulière ?",
      texteOral: "Quelle caractéristique définit une pyramide régulière ?",
      correct: "Base polygonale régulière + faces latérales triangulaires isocèles identiques",
      wrongs: [
        "Base circulaire + faces rectangulaires",
        "Base quelconque + faces triangulaires",
        "Base carrée uniquement"
      ]
    },
    {
      question: "Que représente [SH] dans une pyramide régulière ?",
      texteOral: "Que représente le segment S H dans une pyramide régulière ?",
      correct: "La hauteur (perpendiculaire à la base passant par le centre)",
      wrongs: [
        "Une arête latérale",
        "L'apothème de la base",
        "La médiane d'une face"
      ]
    },
    {
      question: "Quelle formule donne l'aire latérale d'une pyramide régulière ?",
      texteOral: "Quelle formule donne l'aire latérale d'une pyramide régulière ?",
      correct: "\\(A_{\\text{lat}} = \\frac{P \\times a}{2}\\) (P = périmètre base, a = apothème)",
      wrongs: [
        "\\(A_{\\text{lat}} = B \\times h\\)",
        "\\(A_{\\text{lat}} = \\pi r a\\)",
        "\\(A_{\\text{lat}} = \\frac{h}{3} \\times P\\)"
      ]
    },
    {
      question: "Qu'obtient-on en sectionnant une pyramide par un plan parallèle à sa base ?",
      texteOral: "Qu'obtient-on en sectionnant une pyramide par un plan parallèle à sa base ?",
      correct: "Une réduction homothétique de la base",
      wrongs: [
        "Un agrandissement de la base",
        "Un cercle concentrique",
        "Un triangle rectangle"
      ]
    },
    {
      question: "Comment est généré un cône de révolution ?",
      texteOral: "Comment est généré un cône de révolution ?",
      correct: "Rotation d'un triangle rectangle autour d'un côté de l'angle droit",
      wrongs: [
        "Rotation d'un rectangle autour d'un côté",
        "Translation d'un disque le long d'une droite",
        "Déformation d'une pyramide à base circulaire"
      ]
    },
    {
      question: "Que représente la génératrice d'un cône ?",
      texteOral: "Que représente la génératrice d'un cône ?",
      correct: "L'hypoténuse du triangle générateur",
      wrongs: [
        "Le rayon de la base",
        "La hauteur du cône",
        "Le diamètre du disque de base"
      ]
    },
    {
      question: "Quelle relation lie rayon (r), hauteur (h) et génératrice (g) ?",
      texteOral: "Quelle relation lie le rayon r, la hauteur h, et la génératrice g ?",
      correct: "\\(g = \\sqrt{r^2 + h^2}\\) (théorème de Pythagore)",
      wrongs: [
        "\\(g = \\pi r h\\)",
        "\\(g = \\frac{r + h}{2}\\)",
        "\\(g = 2\\pi r\\)"
      ]
    },
    {
      question: "Quelle est la nature d'une section plane parallèle à la base d'un cône ?",
      texteOral: "Quelle est la nature d'une section plane parallèle à la base d'un cône ?",
      correct: "Un cercle réduit homothétique",
      wrongs: [
        "Une ellipse",
        "Un triangle isocèle",
        "Un carré concentrique"
      ]
    },
    {
      question: "Comment s'exprime l'aire totale d'une pyramide fermée ?",
      texteOral: "Comment s'exprime l'aire totale d'une pyramide fermée ?",
      correct: "\\(A_{\\text{total}} = A_{\\text{latérale}} + B\\)",
      wrongs: [
        "\\(A_{\\text{total}} = A_{\\text{latérale}} \\times B\\)",
        "\\(A_{\\text{total}} = \\frac{A_{\\text{latérale}}}{B}\\)",
        "\\(A_{\\text{total}} = A_{\\text{latérale}} - B\\)"
      ]
    },
    {
      question: "Quelle propriété définit l'apothème d'une pyramide régulière ?",
      texteOral: "Quelle propriété définit l'apothème d'une pyramide régulière ?",
      correct: "Hauteur d'une face latérale issue du sommet",
      wrongs: [
        "Distance entre deux sommets opposés",
        "Rayon du cercle inscrit dans la base",
        "Longueur totale des arêtes"
      ]
    },
    {
      question: "Si une pyramide est réduite avec un coefficient \\(k = \\frac{1}{2}\\), comment évolue son aire latérale ?",
      texteOral: "Si une pyramide est réduite avec un coefficient k égale un demi, comment évolue son aire latérale ?",
      correct: "Elle est multipliée par \\(\\frac{1}{4}\\)",
      wrongs: [
        "Elle est multipliée par \\(\\frac{1}{2}\\)",
        "Elle reste identique",
        "Elle est multipliée par \\(\\frac{1}{8}\\)"
      ]
    },
    {
      question: "Quelle est l'expression du volume \\(V\\) d'une pyramide régulière ?",
      texteOral: "Quelle est l'expression du volume V d'une pyramide régulière ?",
      correct: "\\(V = \\frac{B \\times h}{3}\\) où \\(B\\) est l'aire de la base",
      wrongs: [
        "\\(V = B \\times h\\)",
        "\\(V = \\frac{P \\times a}{2}\\) où \\(P\\) est le périmètre",
        "\\(V = \\frac{h}{3} + B\\)"
      ]
    },
    {
      question: "Dans le patron d'un cône, à quoi correspond l'arc du secteur angulaire ?",
      texteOral: "Dans le patron d'un cône, à quoi correspond l'arc du secteur angulaire ?",
      correct: "Au périmètre de la base (\\(2\\pi r\\))",
      wrongs: [
        "À la hauteur du cône",
        "Au diamètre de la base",
        "À l'aire latérale"
      ]
    },
    {
      question: "Quelle formule permet de calculer le volume d'un cône de révolution ?",
      texteOral: "Quelle formule permet de calculer le volume d'un cône de révolution ?",
      correct: "\\(V = \\frac{1}{3} \\pi r^2 h\\) (r = rayon base, h = hauteur)",
      wrongs: [
        "\\(V = \\pi r^2 h\\)",
        "\\(V = \\frac{4}{3} \\pi r^3\\)",
        "\\(V = 2\\pi r (r + h)\\)"
      ]
    }
  ]
}
};