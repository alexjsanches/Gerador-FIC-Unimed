import { useState } from "react";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";
import React from "react";
import InputMask from "react-input-mask";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  useColorMode,
  IconButton,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Badge,
  Stack,
  Flex,
  CircularProgress,
  Grid,
  Select,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
} from "@chakra-ui/react";

const SourceFileUrl = "https://alexjsanches.github.io/Gerador-FIC-Unimed/files/FIC+DS.pdf";
const SourceFileUrl2 = "https://alexjsanches.github.io/monaiza/proposta.pdf";

const IndexPage = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  const toast = useToast();
  const [formValues, setFormValues] = useState({
    pessoa: "",
    plano: "",
    inclusao: "",
    razao_social: "",
    cpf_cnpj: "",
    corretor_nome: "",
    corretor_cpf: "",
    //titular---------------
    tit_nome: "",
    tit_dn: "",
    tit_sexo: "",
    tit_estcivil: "",
    tit_nomemae: "",
    tit_nacionalidade: "BRASILEIRO",
    tit_ufnatural: "",
    tit_cidadenatural: "",
    tit_celular: "",
    tit_email: "",
    tit_cpf: "",
    tit_rg: "",
    tit_emissor_rg: "",
    tit_dt_emissao: "",
    tit_dnv: "",
    tit_cns: "",
    //Dependente 1 ------------------------
    dep1_nome: "",
    dep1_dn: "",
    dep1_sexo: "",
    dep1_estcivil: "",
    dep1_nomemae: "",
    dep1_celular: "",
    dep1_cpf: "",
    dep1_rg: "",
    dep1_orgao_exp: "",
    dep1_cns: "",
    dep1_parentesco: "",
    //Dependente 2 ------------------------
    dep2_nome: "",
    dep2_dn: "",
    dep2_sexo: "",
    dep2_estcivil: "",
    dep2_nomemae: "",
    dep2_celular: "",
    dep2_cpf: "",
    dep2_rg: "",
    dep_orgao_exp: "",
    dep2_cns: "",
    dep2_parentesco: "",
    //Dependente 3 ------------------------
    dep3_nome: "",
    dep3_dn: "",
    dep3_sexo: "",
    dep3_estcivil: "",
    dep3_nomemae: "",
    dep3_celular: "",
    dep3_cpf: "",
    dep3_rg: "",
    dep3_orgao_exp: "",
    dep3_cns: "",
    dep3_parentesco: "",
    //Dependente 4 ------------------------
    dep4_nome: "",
    dep4_dn: "",
    dep4_sexo: "",
    dep4_estcivil: "",
    dep4_nomemae: "",
    dep4_celular: "",
    dep4_cpf: "",
    dep4_rg: "",
    dep4_orgao_exp: "",
    dep4_cns: "",
    dep4_parentesco: "",
  });

  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");

  function onBlurCep(ev) {
    const { value } = ev.target;

    const cep = value?.replace(/[^0-9]/g, "");

    if (cep?.length !== 8) {
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then((res) => res.json())
      .then((data) => {
        setLogradouro(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
        setUf(data.uf);
        // Escrever no PDF usando a variável logradouroUpperCase
      });
  }

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const enviarFormulario = async () => {
    setLoading(true); // set loading to true

    // Carrega o arquivo PDF de origem
    const pdfDoc = await PDFDocument.load(
      await fetch(SourceFileUrl).then((res) => res.arrayBuffer())
    );

    const checkboxFields = [
      // Planos------------------------------------
      { fieldName: "facil_enf", value: formValues.plano === "X1" },
      { fieldName: "pleno_enf", value: formValues.plano === "X2" },
      { fieldName: "pleno_apt", value: formValues.plano === "X3" },
      { fieldName: "mais_enf", value: formValues.plano === "X4" },
      { fieldName: "essencial_enf", value: formValues.plano === "X9" },
      { fieldName: "essencial_apt", value: formValues.plano === "X10" },
      { fieldName: "pontual_enf", value: formValues.plano === "X11" },
      { fieldName: "pontual_apt", value: formValues.plano === "X12" },
      { fieldName: "equilibrio_enf", value: formValues.plano === "X5" },
      { fieldName: "equilibrio_apt", value: formValues.plano === "X6" },
      { fieldName: "udiplan_enf", value: formValues.plano === "X7" },
      { fieldName: "udiplan_apt", value: formValues.plano === "X8" },
      { fieldName: "uniplan_enf", value: formValues.plano === "X13" },
      { fieldName: "uniplan_apt", value: formValues.plano === "X14" },
      //Pessoa----------------------------------------------
      { fieldName: "PJ", value: formValues.pessoa === "juridica" },
      { fieldName: "PF", value: formValues.pessoa === "fisica" },
      // Inclusão---------------------------------------
      {
        fieldName: "Inclusao_tit",
        value:
          formValues.inclusao === "tit" || formValues.inclusao === "tit_dep",
      },
      { fieldName: "Inclusao_dep", value: formValues.inclusao === "tit_dep" },

      // adicionar outros campos de checkbox aqui
    ];

    const formatDate = (fieldName, value) => {
      if (!value) {
        return { fieldName, value: "" };
      }

      const date = new Date(value);
      const offsetInMs = date.getTimezoneOffset() * 60 * 1000;
      const correctedDate = new Date(date.getTime() + offsetInMs);
      const day = correctedDate.getDate().toString().padStart(2, "0");
      const month = (correctedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = correctedDate.getFullYear().toString();

      return { fieldName, value: `${day}/${month}/${year}` };
    };

    const today = new Date();
    const dateString = today.toLocaleDateString("pt-BR");
    const cidadeComData = `${cidade}, ${dateString}`;

    const fieldValues = [
      //--------------------TITULAR---------------------------
      { fieldName: "corretor_nome", value: formValues.corretor_nome },
      { fieldName: "corretor_cpf", value: formValues.corretor_cpf },
      { fieldName: "razao_social", value: formValues.razao_social },
      { fieldName: "cpf_cnpj", value: formValues.cpf_cnpj },
      { fieldName: "local_dt", value: cidadeComData },
      { fieldName: "local", value: cidade },
      { fieldName: "tit_nome", value: formValues.tit_nome },
      {
        fieldName: "tit_dn",
        value: formatDate("tit_dn", formValues.tit_dn).value,
      },
      { fieldName: "tit_sexo", value: formValues.tit_sexo },
      { fieldName: "tit_estcivil", value: formValues.tit_estcivil },
      { fieldName: "tit_nomemae", value: formValues.tit_nomemae },
      { fieldName: "tit_nacionalidade", value: formValues.tit_nacionalidade },
      { fieldName: "tit_ufnatural", value: formValues.tit_ufnatural },
      { fieldName: "tit_cidadenatural", value: formValues.tit_cidadenatural },
      { fieldName: "tit_cep", value: cep },
      { fieldName: "tit_cidade", value: cidade },
      { fieldName: "tit_uf", value: uf },
      { fieldName: "tit_logradouro", value: logradouro },
      { fieldName: "tit_numero", value: numero },
      { fieldName: "tit_complemento", value: complemento },
      { fieldName: "tit_bairro", value: bairro },
      { fieldName: "tit_celular", value: formValues.tit_celular },
      { fieldName: "tit_email", value: formValues.tit_email },
      { fieldName: "tit_cpf", value: formValues.tit_cpf },
      { fieldName: "tit_rg", value: formValues.tit_rg },
      { fieldName: "tit_emissor_rg", value: formValues.tit_emissor_rg },
      {
        fieldName: "tit_dt_emissao",
        value: formatDate("tit_dt_emissao", formValues.tit_dt_emissao).value,
      },
      { fieldName: "tit_dnv", value: formValues.tit_dnv },
      { fieldName: "tit_cns", value: formValues.tit_cns },
      //--------------------DEP1---------------------------
      { fieldName: "dep1_nome", value: formValues.dep1_nome },
      {
        fieldName: "dep1_dn",
        value: formatDate("dep1_dn", formValues.dep1_dn).value,
      },
      { fieldName: "dep1_sexo", value: formValues.dep1_sexo },
      { fieldName: "dep1_estcivil", value: formValues.dep1_estcivil },
      { fieldName: "dep1_nomemae", value: formValues.dep1_nomemae },
      { fieldName: "dep1_celular", value: formValues.dep1_celular },
      { fieldName: "dep1_parentesco", value: formValues.dep1_parentesco },
      { fieldName: "dep1_cpf", value: formValues.dep1_cpf },
      { fieldName: "dep1_rg", value: formValues.dep1_rg },
      { fieldName: "dep1_orgao_exp", value: formValues.dep1_orgao_exp },
      { fieldName: "dep1_cns", value: formValues.dep1_cns },

      //--------------------DEP2---------------------------
      { fieldName: "dep2_nome", value: formValues.dep2_nome },
      {
        fieldName: "dep2_dn",
        value: formatDate("dep2_dn", formValues.dep2_dn).value,
      },
      { fieldName: "dep2_sexo", value: formValues.dep2_sexo },
      { fieldName: "dep2_estcivil", value: formValues.dep2_estcivil },
      { fieldName: "dep2_nomemae", value: formValues.dep2_nomemae },
      { fieldName: "dep2_celular", value: formValues.dep2_celular },
      { fieldName: "dep2_parentesco", value: formValues.dep2_parentesco },
      { fieldName: "dep2_cpf", value: formValues.dep2_cpf },
      { fieldName: "dep2_rg", value: formValues.dep2_rg },
      { fieldName: "dep_orgao_exp", value: formValues.dep_orgao_exp },
      { fieldName: "dep2_cns", value: formValues.dep2_cns },
      //--------------------DEP3---------------------------
      { fieldName: "dep3_nome", value: formValues.dep3_nome },
      {
        fieldName: "dep3_dn",
        value: formatDate("dep3_dn", formValues.dep3_dn).value,
      },
      { fieldName: "dep3_sexo", value: formValues.dep3_sexo },
      { fieldName: "dep3_estcivil", value: formValues.dep3_estcivil },
      { fieldName: "dep3_nomemae", value: formValues.dep3_nomemae },
      { fieldName: "dep3_celular", value: formValues.dep3_celular },
      { fieldName: "dep3_parentesco", value: formValues.dep3_parentesco },
      { fieldName: "dep3_cpf", value: formValues.dep3_cpf },
      { fieldName: "dep3_rg", value: formValues.dep3_rg },
      { fieldName: "dep3_orgao_exp", value: formValues.dep3_orgao_exp },
      { fieldName: "dep3_cns", value: formValues.dep3_cns },
      //--------------------DEP4---------------------------
      { fieldName: "dep4_nome", value: formValues.dep4_nome },
      {
        fieldName: "dep4_dn",
        value: formatDate("dep4_dn", formValues.dep4_dn).value,
      },
      { fieldName: "dep4_sexo", value: formValues.dep4_sexo },
      { fieldName: "dep4_estcivil", value: formValues.dep4_estcivil },
      { fieldName: "dep4_nomemae", value: formValues.dep4_nomemae },
      { fieldName: "dep4_celular", value: formValues.dep4_celular },
      { fieldName: "dep4_parentesco", value: formValues.dep4_parentesco },
      { fieldName: "dep4_cpf", value: formValues.dep4_cpf },
      { fieldName: "dep4_rg", value: formValues.dep4_rg },
      { fieldName: "dep4_orgao_exp", value: formValues.dep4_orgao_exp },
      { fieldName: "dep4_cns", value: formValues.dep4_cns },
    ];

    const dayString = String(today.getDate()).padStart(2, "0");
    const dia = { fieldName: "dia", value: dayString };
    fieldValues.push(dia);
    const monthString = String(today.getMonth() + 1).padStart(2, "0");
    const mes = { fieldName: "mes", value: monthString };
    fieldValues.push(mes);
    const yearString = String(today.getFullYear());
    const ano = { fieldName: "ano", value: yearString };
    fieldValues.push(ano);

    // Preenche os campos do formulário
    const form = pdfDoc.getForm();

    // Preenchendo os campos de texto
    fieldValues.forEach((field) => {
      const textField = form.getTextField(field.fieldName);
      if (textField) {
        textField.setText(field.value.toUpperCase());
      }
    });

    // Marcando ou desmarcando os campos de checkbox
    checkboxFields.forEach((field) => {
      const checkBox = form.getCheckBox(field.fieldName);
      if (checkBox) {
        if (field.value) {
          checkBox.check();
        } else {
          checkBox.uncheck();
        }
      }
    });

    // Salva o arquivo PDF preenchido no disco rígido
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "FIC+DS.pdf");

    setLoading(false); // set loading to false

    // Exibe o Toast
    toast({
      title: "PDF gerado com sucesso",
      status: "success",
      duration: 3000,
      isClosable: false,
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newValue = value.toUpperCase(); // transforma o valor em maiúsculo
    setFormValues((prevState) => ({ ...prevState, [name]: newValue }));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleTabClick = (index) => {
    setCurrentStep(index);
  };

  const [numDependentes, setNumDependentes] = useState(0);
  const [nextStep, setNextStep] = useState(3);

  const cpfsPorNome = {
    "ADRIENE DE PAULA": "111.935.506-02",
    "AGATHA FERNANDA CESARIO": "015.514.436-78",
    "ALEXANDRE FERREIRA": "085.527.196-57",
    "ALEXANDRE JUNIO GOMES SANCHES": "028.711.482-10",
    "ALINE OLIVEIRA SANTOS GUERRA": "037.476.711-44",
    "ANA CAROLINA OLIVEIRA": "022.430.876-93",
    "ANA CLAUDIA SANTANA": "617.390.141-20",
    "ANDRE LUIS BRANDAO": "288.905.718-61",
    "ANDRÉ LUIZ DOS SANTOS": "080.587.586-71",
    "ANDREA GONCALVES ARAUJO DE PAULA": "031.687.846-48",
    "ANNE SOARES CARVALHO": "068.402.246-00",
    "BEATRIZ DA SILVA": "758.349.796-53",
    "BETHANIA NASCIMENTO BASTOS": "065.382.386-02",
    "BIANCA CRISTINA ROCHA": "132.911.446-94",
    "BIANCA DOS SANTOS BORGES": "077.272.066-52",
    "BRUNO PAULINO SILVA": "074.161.436-75",
    "CAIO CESAR SANTOS": "078.803.036-18",
    "CAROLINE RAMOS": "074.883.406-04",
    "CASSIO QUEIROZ MATRINS": "126.316.826-45",
    "CICERO ROBERTO SILVA": "431.777.191-87",
    "CINTHIA DOMINGUES OLIVEIRA LUIZ": "326.060.118-05",
    "CRISTIANE FERREIRA CASTRO": "106.746.546-41",
    "CRISTIANO MACHADO BERNARDES": "044.287.556-86",
    "DANYELLE FERNANDES GONCALVES": "101.574.646-28",
    "DANGELIS RODRIGUES KAKOI": "006.987.388-61",
    "DIEGO HENRIQUE LEÃO": "121.151.596-67",
    "DIEGO RAMOS": "080.874.216-71",
    "DIVINO DE PAULA FERREIRA": "577.980.366-87",
    "DOUGLAS MEDEIROS SILVA": "123.855.966-28",
    "DOUGLAS SOARES": "039.328.306-28",
    "EDER JUNIO DA SILVEIRA": "092.783.526-67",
    "EDNA FRANCA DE ATAIDE": "226.674.398-80",
    "ERICA SOLANO SANTOS": "015.990.186-32",
    "ERIVALDO CESAR TAVARES": "552.873.101-10",
    "EROSMILDA ALVES DE SOUSA": "032.781.376-80",
    "FABIANA DOS SANTOS BORGES": "037.221.956-08",
    "FRANCIELLE SILVA DIAS": "107.544.776-30",
    "GABRIELA ANDRADE SANTI TULINI": "120.324.146-19",
    "GIZELE DE JESUS PREIRA REIS": "079.715.215-61",
    "GLEUSSON ALVES NEVES": "828.004.056-00",
    "HEBERSON FARLEY SOARES FIGUEIREDO": "851.017.536-53",
    "IAGO FERREIRA SILVA": "114.925.066-64",
    "ITALO PEGORARI DE ALMEIDA": "065.869.586-01",
    "JESSICA ALVES RAMOS": "387.901.348-93",
    "JESSICA PHIAMA DIAS MELO": "098.792.686-10",
    "JOAO BATISTA ALVES JUNIOR": "372.800.581-91",
    "JORGE LUIZ MARTINEZ PEREIRA": "053.681.867-38",
    "JOSE ROBERTO SOUZA SANTIAGO": "069.093.784-90",
    "JOSY LUCY BARRETO DE SOUZA CAVALCANTE": "060.525.266-10",
    "KAROLNE BORGES NOVAES": "073.789.076-26",
    "KENICHI OTSUKA NETO": "092.747.996-67",
    "KENIEL GUIMARAES MACHADO": "765.921.896-49",
    "LEANDRA GONCALVES ARAUJO": "932.349.106-34",
    "LEANDRO BRUNIO DA SILVA": "932.349.106-34",
    "LETICIA PAULA SANTOS": "041.549.256-44",
    "LUCAS FERNANDO LUIZ": "367.807.218-67",
    "LUCAS MATEUS MARTINS CARDOSO": "069.925.596-13",
    "MARLENE IZAURA DE SOUZA FARIA": "323.034.166-04",
    "MATHEUS ALVES RAMOS": "387.901.358-65",
    "MICHEL RODRIGUES DOS SANTOS": "097.096.726-81",
    "MICHELLE KATRINE LOPES": "102.652.086-02",
    "MURILO OLIVEIRA SILVA": "032.736.021-63",
    "NAIANE AIRES MENDES": "143.960.196-88",
    "NAYARA APARECIDA DE FARIA": "074.250.786-60",
    "NICOLAS AUGUSTO NUNES": "107.739.396-28",
    "RAFAEL DAMAZIO DA COSTA": "092.269.136-33",
    "RAFAEL GORNATTES SILVA": "054.765.246-14",
    "RAPHAEL ALVES DE ANDRADE NACARATO": "055.457.106-47",
    "RAQUEL MENDES RIBEIRO": "079.723.176-58",
    "RHAYSSA DE BASTOS GONZAGA": "094.844.486-07",
    "ROSELAINE DE MELO MONTES": "072.173.166-00",
    "SARA ALVES BRUNIO": "126.570.396-50",
    "SILESIO TRAJANO DOS SANTOS": "828.213.216-00",
    "SYLLAS DA SILVA FARIA": "009.612.191-22",
    "TALITA DOS SANTOS AVILA": "089.895.996-95",
    "TANIA TEREZILA URZEDO DE QUEIROZ": "498.297.006-82",
    "THAIS TAVARES CORREA": "029.993.356-36",
    "THALES VINICIUS QUEIROZ MARTINS": "119.171.366-09",
    "VALERIA CRSITINA MEDEIROS LIMA": "055.716.096-05",
    "VALERIO RODRIGUES NUNES JUNIOR": "016.175.776-69",
    "VERA LUCIA VASCONCELOS MENDES": "896.606.331-49",
    "VINICIUS CALIXTO DA SILVA": "128.160.986-21",
    "VIVIANA PEREIRA ANDRADE": "783.720.386-00",
    "WELINGTON JOSE DOS SANTOS FARIA": "077.760.616-03",
    "WILLIAM FERREIRA SILVA": "539.371.636-20",
    "ROBERVAL MONTES DA SILVA": "506.451.296-15",
    // Adicione outras entradas conforme necessário
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    const name = event.target.name;

    setFormValues({
      ...formValues,
      [name]: value,
      corretor_cpf: cpfsPorNome[value] || "",
    });
  };

  const handleSelectChange1 = (event) => {
    const value = event.target.value;
    setFormValues({ ...formValues, [event.target.name]: value });

    if (value === "tit_dep") {
      setNumDependentes(0);
      setNextStep(4);
    } else {
      setNumDependentes(-1);
      setNextStep(3);
    }
  };

  const handleNumDependentesChange = (event) => {
    const value = parseInt(event.target.value);
    setNumDependentes(value);

    switch (value) {
      case 1:
        setNextStep(4);
        break;
      case 2:
        setNextStep(5);
        break;
      case 3:
        setNextStep(6);
        break;
      case 4:
        setNextStep(7);
        break;
      default:
        setNextStep(3);
    }
  };

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position={"relative"}
      top={"5vh"}
      w={"40%"}
      left={"30%"}
    >
      <Stack direction="row" alignItems="center" justifyContent="center">
        <Badge colorScheme="whatsapp">FIC + DS Unimed</Badge>
      </Stack>

      <Stack>
        <FormControl>
          <Tabs
            width="100%"
            index={currentStep}
            variant="soft-rounded"
            colorScheme="messenger"
          >
            <TabList
              display="flex"
              justifyContent="space-between"
              flexWrap="nowrap"
              width="100%"
            >
              <Tab onClick={() => handleTabClick(0)}>Dados da Empresa</Tab>
              <Tab onClick={() => handleTabClick(1)}>Dados do Titular</Tab>
              <Tab onClick={() => handleTabClick(2)}>Documentos do Titular</Tab>
              <Tab onClick={() => handleTabClick(3)}>Endereço do Titular</Tab>
              <Tab
                onClick={() => handleTabClick(4)}
                isDisabled={numDependentes < 1}
              >
                Dep 1
              </Tab>
              <Tab
                onClick={() => handleTabClick(5)}
                isDisabled={numDependentes < 2}
              >
                Dep 2
              </Tab>
              <Tab
                onClick={() => handleTabClick(6)}
                isDisabled={numDependentes < 3}
              >
                Dep 3
              </Tab>
              <Tab
                onClick={() => handleTabClick(7)}
                isDisabled={numDependentes < 4}
              >
                Dep 4
              </Tab>
            </TabList>

            <TabPanels position={"relative"} mt={"2vh"}>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormControl>
                      <FormLabel>Corretor</FormLabel>
                      <Select
                        variant="filled"
                        placeholder="Selecione"
                        name="corretor_nome"
                        value={formValues.corretor_nome}
                        onChange={handleSelectChange}
                      >
                        <option value="ADRIENE DE PAULA">
                          ADRIENE DE PAULA
                        </option>
                        <option value="AGATHA FERNANDA CESARIO">
                          AGATHA FERNANDA CESARIO
                        </option>
                        <option value="ALEXANDRE FERREIRA">
                          ALEXANDRE FERREIRA
                        </option>
                        <option value="ALEXANDRE JUNIO GOMES SANCHES">
                          ALEXANDRE JUNIO GOMES SANCHES
                        </option>
                        <option value="ALINE OLIVEIRA SANTOS GUERRA">
                          ALINE OLIVEIRA SANTOS GUERRA
                        </option>
                        <option value="ANA CAROLINA OLIVEIRA">
                          ANA CAROLINA OLIVEIRA
                        </option>
                        <option value="ANA CLAUDIA SANTANA">
                          ANA CLAUDIA SANTANA
                        </option>
                        <option value="ANDRE LUIS BRANDAO">
                          ANDRE LUIS BRANDAO
                        </option>
                        <option value="ANDRÉ LUIZ DOS SANTOS">
                          ANDRÉ LUIZ DOS SANTOS
                        </option>
                        <option value="ANDREA GONCALVES ARAUJO DE PAULA">
                          ANDREA GONCALVES ARAUJO DE PAULA
                        </option>
                        <option value="ANNE SOARES CARVALHO">
                          ANNE SOARES CARVALHO
                        </option>
                        <option value="BEATRIZ DA SILVA">
                          BEATRIZ DA SILVA
                        </option>
                        <option value="BETHANIA NASCIMENTO BASTOS">
                          BETHANIA NASCIMENTO BASTOS
                        </option>
                        <option value="BIANCA CRISTINA ROCHA">
                          BIANCA CRISTINA ROCHA
                        </option>
                        <option value="BIANCA DOS SANTOS BORGES">
                          BIANCA DOS SANTOS BORGES
                        </option>
                        <option value="BRUNO PAULINO SILVA">
                          BRUNO PAULINO SILVA
                        </option>
                        <option value="CAIO CESAR SANTOS">
                          CAIO CESAR SANTOS
                        </option>
                        <option value="CAROLINE RAMOS">CAROLINE RAMOS</option>
                        <option value="CASSIO QUEIROZ MATRINS">
                          CASSIO QUEIROZ MATRINS
                        </option>
                        <option value="CICERO ROBERTO SILVA">
                          CICERO ROBERTO SILVA
                        </option>
                        <option value="CINTHIA DOMINGUES OLIVEIRA LUIZ">
                          CINTHIA DOMINGUES OLIVEIRA LUIZ
                        </option>
                        <option value="CRISTIANE FERREIRA CASTRO">
                          CRISTIANE FERREIRA CASTRO
                        </option>
                        <option value="CRISTIANO MACHADO BERNARDES">
                          CRISTIANO MACHADO BERNARDES
                        </option>
                        <option value="DANYELLE FERNANDES GONCALVES">
                          DANYELLE FERNANDES GONCALVES
                        </option>
                        <option value="DANGELIS RODRIGUES KAKOI">
                          DANGELIS RODRIGUES KAKOI
                        </option>
                        <option value="DIEGO HENRIQUE LEÃO">
                          DIEGO HENRIQUE LEÃO
                        </option>
                        <option value="DIEGO RAMOS">DIEGO RAMOS</option>
                        <option value="DIVINO DE PAULA FERREIRA">
                          DIVINO DE PAULA FERREIRA
                        </option>
                        <option value="DOUGLAS MEDEIROS SILVA">
                          DOUGLAS MEDEIROS SILVA
                        </option>
                        <option value="DOUGLAS SOARES">DOUGLAS SOARES</option>
                        <option value="EDER JUNIO DA SILVEIRA">
                          EDER JUNIO DA SILVEIRA
                        </option>
                        <option value="EDNA FRANCA DE ATAIDE">
                          EDNA FRANCA DE ATAIDE
                        </option>
                        <option value="ERICA SOLANO SANTOS">
                          ERICA SOLANO SANTOS
                        </option>
                        <option value="ERIVALDO CESAR TAVARES">
                          ERIVALDO CESAR TAVARES
                        </option>
                        <option value="EROSMILDA ALVES DE SOUSA">
                          EROSMILDA ALVES DE SOUSA
                        </option>
                        <option value="FABIANA DOS SANTOS BORGES">
                          FABIANA DOS SANTOS BORGES
                        </option>
                        <option value="FRANCIELLE SILVA DIAS">
                          FRANCIELLE SILVA DIAS
                        </option>
                        <option value="GABRIELA ANDRADE SANTI TULINI">
                          GABRIELA ANDRADE SANTI TULINI
                        </option>
                        <option value="GIZELE DE JESUS PREIRA REIS">
                          GIZELE DE JESUS PREIRA REIS
                        </option>
                        <option value="GLEUSSON ALVES NEVES">
                          GLEUSSON ALVES NEVES
                        </option>
                        <option value="HEBERSON FARLEY SOARES FIGUEIREDO">
                          HEBERSON FARLEY SOARES FIGUEIREDO
                        </option>
                        <option value="IAGO FERREIRA SILVA">
                          IAGO FERREIRA SILVA
                        </option>
                        <option value="ITALO PEGORARI DE ALMEIDA">
                          ITALO PEGORARI DE ALMEIDA
                        </option>
                        <option value="JESSICA ALVES RAMOS">
                          JESSICA ALVES RAMOS
                        </option>
                        <option value="JESSICA PHIAMA DIAS MELO">
                          JESSICA PHIAMA DIAS MELO
                        </option>
                        <option value="JOAO BATISTA ALVES JUNIOR">
                          JOAO BATISTA ALVES JUNIOR
                        </option>
                        <option value="JORGE LUIZ MARTINEZ PEREIRA">
                          JORGE LUIZ MARTINEZ PEREIRA
                        </option>
                        <option value="JOSE ROBERTO SOUZA SANTIAGO">
                          JOSE ROBERTO SOUZA SANTIAGO
                        </option>
                        <option value="JOSY LUCY BARRETO DE SOUZA CAVALCANTE">
                          JOSY LUCY BARRETO DE SOUZA CAVALCANTE
                        </option>
                        <option value="KAROLNE BORGES NOVAES">
                          KAROLNE BORGES NOVAES
                        </option>
                        <option value="KENICHI OTSUKA NETO">
                          KENICHI OTSUKA NETO
                        </option>
                        <option value="KENIEL GUIMARAES MACHADO">
                          KENIEL GUIMARAES MACHADO
                        </option>
                        <option value="LEANDRA GONCALVES ARAUJO">
                          LEANDRA GONCALVES ARAUJO
                        </option>
                        <option value="LEANDRO BRUNIO DA SILVA">
                          LEANDRO BRUNIO DA SILVA
                        </option>
                        <option value="LETICIA PAULA SANTOS">
                          LETICIA PAULA SANTOS
                        </option>
                        <option value="LUCAS FERNANDO LUIZ">
                          LUCAS FERNANDO LUIZ
                        </option>
                        <option value="LUCAS MATEUS MARTINS CARDOSO">
                          LUCAS MATEUS MARTINS CARDOSO
                        </option>
                        <option value="MARLENE IZAURA DE SOUZA FARIA">
                          MARLENE IZAURA DE SOUZA FARIA
                        </option>
                        <option value="MATHEUS ALVES RAMOS">
                          MATHEUS ALVES RAMOS
                        </option>
                        <option value="MICHEL RODRIGUES DOS SANTOS">
                          MICHEL RODRIGUES DOS SANTOS
                        </option>
                        <option value="MICHELLE KATRINE LOPES">
                          MICHELLE KATRINE LOPES
                        </option>
                        <option value="MURILO OLIVEIRA SILVA">
                          MURILO OLIVEIRA SILVA
                        </option>
                        <option value="NAIANE AIRES MENDES">
                          NAIANE AIRES MENDES
                        </option>
                        <option value="NAYARA APARECIDA DE FARIA">
                          NAYARA APARECIDA DE FARIA
                        </option>
                        <option value="NICOLAS AUGUSTO NUNES">
                          NICOLAS AUGUSTO NUNES
                        </option>
                        <option value="RAFAEL DAMAZIO DA COSTA">
                          RAFAEL DAMAZIO DA COSTA
                        </option>
                        <option value="RAFAEL GORNATTES SILVA">
                          RAFAEL GORNATTES SILVA
                        </option>
                        <option value="RAPHAEL ALVES DE ANDRADE NACARATO">
                          RAPHAEL ALVES DE ANDRADE NACARATO
                        </option>
                        <option value="RAQUEL MENDES RIBEIRO">
                          RAQUEL MENDES RIBEIRO
                        </option>
                        <option value="RHAYSSA DE BASTOS GONZAGA">
                          RHAYSSA DE BASTOS GONZAGA
                        </option>
                        <option value="ROSELAINE DE MELO MONTES">
                          ROSELAINE DE MELO MONTES
                        </option>
                        <option value="SARA ALVES BRUNIO">
                          SARA ALVES BRUNIO
                        </option>
                        <option value="SILESIO TRAJANO DOS SANTOS">
                          SILESIO TRAJANO DOS SANTOS
                        </option>
                        <option value="SYLLAS DA SILVA FARIA">
                          SYLLAS DA SILVA FARIA
                        </option>
                        <option value="TALITA DOS SANTOS AVILA">
                          TALITA DOS SANTOS AVILA
                        </option>
                        <option value="TANIA TEREZILA URZEDO DE QUEIROZ">
                          TANIA TEREZILA URZEDO DE QUEIROZ
                        </option>
                        <option value="THAIS TAVARES CORREA">
                          THAIS TAVARES CORREA
                        </option>
                        <option value="THALES VINICIUS QUEIROZ MARTINS">
                          THALES VINICIUS QUEIROZ MARTINS
                        </option>
                        <option value="VALERIA CRSITINA MEDEIROS LIMA">
                          VALERIA CRSITINA MEDEIROS LIMA
                        </option>
                        <option value="VALERIO RODRIGUES NUNES JUNIOR">
                          VALERIO RODRIGUES NUNES JUNIOR
                        </option>
                        <option value="VERA LUCIA VASCONCELOS MENDES">
                          VERA LUCIA VASCONCELOS MENDES
                        </option>
                        <option value="VINICIUS CALIXTO DA SILVA">
                          VINICIUS CALIXTO DA SILVA
                        </option>
                        <option value="VIVIANA PEREIRA ANDRADE">
                          VIVIANA PEREIRA ANDRADE
                        </option>
                        <option value="WELINGTON JOSE DOS SANTOS FARIA">
                          WELINGTON JOSE DOS SANTOS FARIA
                        </option>
                        <option value="WILLIAM FERREIRA SILVA">
                          WILLIAM FERREIRA SILVA
                        </option>
                        <option value="ROBERVAL MONTES DA SILVA">
                          ROBERVAL MONTES DA SILVA
                        </option>
                      </Select>
                    </FormControl>
                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Pessoa</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="pessoa"
                          value={formValues.pessoa}
                          onChange={handleSelectChange}
                        >
                          <option value="fisica">FÍSICA</option>
                          <option value="juridica">JURÍDICA</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Inclusão</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="inclusao"
                          value={formValues.inclusao}
                          onChange={handleSelectChange1}
                        >
                          <option value="tit">TITULAR</option>
                          <option value="tit_dep">TITULAR+DEPENDENTES</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Nº de dependentes:</FormLabel>
                        <Select
                          variant="filled"
                          name="numDependentes"
                          value={numDependentes}
                          onChange={handleNumDependentesChange}
                          disabled={formValues.inclusao !== "tit_dep"}
                        >
                          <option value={0}>Selecione</option>
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </Select>
                      </FormControl>
                    </Flex>
                    <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                      <FormControl>
                        <FormLabel>CNPJ</FormLabel>
                        <InputMask
                          mask="99.999.999/9999-99"
                          variant="filled"
                          name="cpf_cnpj"
                          value={formValues.cpf_cnpj}
                          onChange={handleInputChange}
                          w={"25vh"}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Razão Social</FormLabel>
                        <Input
                          variant="filled"
                          name="razao_social"
                          value={formValues.razao_social}
                          onChange={handleInputChange}
                          w={"211%"}
                        />
                      </FormControl>
                    </Grid>
                    <FormLabel>Planos</FormLabel>
                    <Select
                      variant="filled"
                      placeholder="Selecione um plano"
                      name="plano"
                      value={formValues.plano}
                      onChange={handleSelectChange}
                    >
                      <optgroup label="Municipal">
                        <option value="X1">FÁCIL - Enf</option>
                        <option value="X2">PLENO - Enf</option>
                        <option value="X3">PLENO - Apt</option>
                        <option value="X4">UNIMED MAIS - Enf</option>
                        <option value="X5">EQUILÍBRIO - Enf</option>
                        <option value="X6">EQUILÍBRIO - Apt</option>
                        <option value="X7">UDIPLAN - Enf</option>
                        <option value="X8">UDIPLAN - Apt</option>
                      </optgroup>
                      <optgroup label="Estadual">
                        <option value="X9">ESSENCIAL - Enf</option>
                        <option value="X10">ESSENCIAL - Apt</option>
                        <option value="X11">PONTUAL - Enf</option>
                        <option value="X12">PONTUAL - Apt</option>
                      </optgroup>
                      <optgroup label="Nacional">
                        <option value="X13">UNIPLAN - Enf</option>
                        <option value="X14">UNIPLAN - Apt</option>
                      </optgroup>
                    </Select>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      variant="filled"
                      name="tit_nome"
                      value={formValues.tit_nome}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_dn"
                          value={formValues.tit_dn}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="tit_sexo"
                          value={formValues.tit_sexo}
                          onChange={handleSelectChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <FormLabel>Nome da Mãe</FormLabel>
                    <Input
                      variant="filled"
                      name="tit_nomemae"
                      value={formValues.tit_nomemae}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="tit_estcivil"
                          value={formValues.tit_estcivil}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Solteiro</option>
                          <option value="2">Casado</option>
                          <option value="3">Companheiro</option>
                          <option value="4">Separado / Divorciado</option>
                          <option value="5">Viúvo</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Nacionalidade</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_nacionalidade"
                          value={formValues.tit_nacionalidade}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_email"
                          value={formValues.tit_email}
                          onChange={handleInputChange}
                          type="email"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <InputMask
                          mask="(99) 99999-9999"
                          variant="filled"
                          name="tit_celular"
                          value={formValues.tit_celular}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>UF Naturalidade</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="tit_ufnatural"
                          value={formValues.tit_ufnatural}
                          onChange={handleSelectChange}
                        >
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Cidade Naturalidade</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_cidadenatural"
                          value={formValues.tit_cidadenatural}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>CPF</FormLabel>
                        <InputMask
                          mask="999.999.999-99"
                          variant="filled"
                          name="tit_cpf"
                          value={formValues.tit_cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_rg"
                          value={formValues.tit_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Órgão Emissor</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_emissor_rg"
                          value={formValues.tit_emissor_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Data de Emissão RG</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_dt_emissao"
                          value={formValues.tit_dt_emissao}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Declaração de Nascido Vivo</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_dnv"
                          value={formValues.tit_dnv}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>CNS</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_cns"
                          value={formValues.tit_cns}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Cep</FormLabel>
                        <InputMask
                          mask="99999-999"
                          variant="filled"
                          name="tit_cep"
                          value={cep}
                          onChange={(ev) => setCep(ev.target.value)}
                          onBlur={onBlurCep}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>

                      <FormControl>
                        <FormLabel>Logradouro</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_logradouro"
                          type="text"
                          value={logradouro.toUpperCase()}
                          onChange={(ev) =>
                            setLogradouro(ev.target.value.toUpperCase())
                          }
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Número</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_numero"
                          type="text"
                          value={numero}
                          onChange={(ev) => setNumero(ev.target.value)}
                        />
                      </FormControl>
                    </Flex>
                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Complemento</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_complemento"
                          type="text"
                          value={complemento}
                          onChange={(ev) => setComplemento(ev.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Bairro</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_bairro"
                          type="text"
                          value={bairro.toUpperCase()}
                          onChange={(ev) => setBairro(ev.target.value)}
                        />
                      </FormControl>
                    </Flex>
                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Cidade</FormLabel>
                        <Input
                          variant="filled"
                          name="tit_cidade"
                          type="text"
                          value={cidade.toUpperCase()}
                          onChange={(ev) => setCidade(ev.target.value)}
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          variant="filled"
                          name="tit_uf"
                          value={uf}
                          onChange={(ev) => setUf(ev.target.value)}
                          placeholder="Selecione"
                        >
                          <option value="SP">São Paulo</option>
                          <option value="SC">Santa Catarina</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </Select>
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      variant="filled"
                      name="dep1_nome"
                      value={formValues.dep1_nome}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          variant="filled"
                          name="dep1_dn"
                          value={formValues.dep1_dn}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep1_sexo"
                          value={formValues.dep1_sexo}
                          onChange={handleSelectChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <FormLabel>Nome da Mãe</FormLabel>
                    <Input
                      variant="filled"
                      name="dep1_nomemae"
                      value={formValues.dep1_nomemae}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>CPF</FormLabel>
                        <InputMask
                          mask="999.999.999-99"
                          variant="filled"
                          name="dep1_cpf"
                          value={formValues.dep1_cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          variant="filled"
                          name="dep1_rg"
                          value={formValues.dep1_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl w={"50vh"}>
                        <FormLabel>Órgão Emissor</FormLabel>
                        <Input
                          variant="filled"
                          name="dep1_orgao_exp"
                          value={formValues.dep1_orgao_exp}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep1_estcivil"
                          value={formValues.dep1_estcivil}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Solteiro</option>
                          <option value="2">Casado</option>
                          <option value="3">Companheiro</option>
                          <option value="4">Separado / Divorciado</option>
                          <option value="5">Viúvo</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Grau de Parentesco</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep1_parentesco"
                          value={formValues.dep1_parentesco}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Cônjuge</option>
                          <option value="2">Companheiro</option>
                          <option value="3">Filhos</option>
                          <option value="4">Filho agregado (maior)</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <InputMask
                          mask="(99) 99999-9999"
                          variant="filled"
                          name="dep1_celular"
                          value={formValues.dep1_celular}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>CNS</FormLabel>
                        <Input
                          variant="filled"
                          name="dep1_cns"
                          value={formValues.dep1_cns}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      variant="filled"
                      name="dep2_nome"
                      value={formValues.dep2_nome}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          variant="filled"
                          name="dep2_dn"
                          value={formValues.dep2_dn}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep2_sexo"
                          value={formValues.dep2_sexo}
                          onChange={handleSelectChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <FormLabel>Nome da Mãe</FormLabel>
                    <Input
                      variant="filled"
                      name="dep2_nomemae"
                      value={formValues.dep2_nomemae}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>CPF</FormLabel>
                        <InputMask
                          mask="999.999.999-99"
                          variant="filled"
                          name="dep2_cpf"
                          value={formValues.dep2_cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          variant="filled"
                          name="dep2_rg"
                          value={formValues.dep2_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl w={"50vh"}>
                        <FormLabel>Órgão Emissor</FormLabel>
                        <Input
                          variant="filled"
                          name="dep_orgao_exp"
                          value={formValues.dep_orgao_exp}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep2_estcivil"
                          value={formValues.dep2_estcivil}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Solteiro</option>
                          <option value="2">Casado</option>
                          <option value="3">Companheiro</option>
                          <option value="4">Separado / Divorciado</option>
                          <option value="5">Viúvo</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Grau de Parentesco</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep2_parentesco"
                          value={formValues.dep2_parentesco}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Cônjuge</option>
                          <option value="2">Companheiro</option>
                          <option value="3">Filhos</option>
                          <option value="4">Filho agregado (maior)</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <InputMask
                          mask="(99) 99999-9999"
                          variant="filled"
                          name="dep2_celular"
                          value={formValues.dep2_celular}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>CNS</FormLabel>
                        <Input
                          variant="filled"
                          name="dep2_cns"
                          value={formValues.dep2_cns}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      variant="filled"
                      name="dep3_nome"
                      value={formValues.dep3_nome}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          variant="filled"
                          name="dep3_dn"
                          value={formValues.dep3_dn}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep3_sexo"
                          value={formValues.dep3_sexo}
                          onChange={handleSelectChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <FormLabel>Nome da Mãe</FormLabel>
                    <Input
                      variant="filled"
                      name="dep3_nomemae"
                      value={formValues.dep3_nomemae}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>CPF</FormLabel>
                        <InputMask
                          mask="999.999.999-99"
                          variant="filled"
                          name="dep3_cpf"
                          value={formValues.dep3_cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          variant="filled"
                          name="dep3_rg"
                          value={formValues.dep3_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl w={"50vh"}>
                        <FormLabel>Órgão Emissor</FormLabel>
                        <Input
                          variant="filled"
                          name="dep3_orgao_exp"
                          value={formValues.dep3_orgao_exp}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep3_estcivil"
                          value={formValues.dep3_estcivil}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Solteiro</option>
                          <option value="2">Casado</option>
                          <option value="3">Companheiro</option>
                          <option value="4">Separado / Divorciado</option>
                          <option value="5">Viúvo</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Grau de Parentesco</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep3_parentesco"
                          value={formValues.dep3_parentesco}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Cônjuge</option>
                          <option value="2">Companheiro</option>
                          <option value="3">Filhos</option>
                          <option value="4">Filho agregado (maior)</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <InputMask
                          mask="(99) 99999-9999"
                          variant="filled"
                          name="dep3_celular"
                          value={formValues.dep3_celular}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>CNS</FormLabel>
                        <Input
                          variant="filled"
                          name="dep3_cns"
                          value={formValues.dep3_cns}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence initial={false} mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabPanel>
                    <FormLabel>Nome</FormLabel>
                    <Input
                      variant="filled"
                      name="dep4_nome"
                      value={formValues.dep4_nome}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          variant="filled"
                          name="dep4_dn"
                          value={formValues.dep4_dn}
                          onChange={handleInputChange}
                          type="date"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Sexo</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep4_sexo"
                          value={formValues.dep4_sexo}
                          onChange={handleSelectChange}
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <FormLabel>Nome da Mãe</FormLabel>
                    <Input
                      variant="filled"
                      name="dep4_nomemae"
                      value={formValues.dep4_nomemae}
                      onChange={handleInputChange}
                    />

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>CPF</FormLabel>
                        <InputMask
                          mask="999.999.999-99"
                          variant="filled"
                          name="dep4_cpf"
                          value={formValues.dep4_cpf}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          variant="filled"
                          name="dep4_rg"
                          value={formValues.dep4_rg}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                      <FormControl w={"50vh"}>
                        <FormLabel>Órgão Emissor</FormLabel>
                        <Input
                          variant="filled"
                          name="dep4_orgao_exp"
                          value={formValues.dep4_orgao_exp}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep4_estcivil"
                          value={formValues.dep4_estcivil}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Solteiro</option>
                          <option value="2">Casado</option>
                          <option value="3">Companheiro</option>
                          <option value="4">Separado / Divorciado</option>
                          <option value="5">Viúvo</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Grau de Parentesco</FormLabel>
                        <Select
                          variant="filled"
                          placeholder="Selecione"
                          name="dep4_parentesco"
                          value={formValues.dep4_parentesco}
                          onChange={handleSelectChange}
                        >
                          <option value="1">Cônjuge</option>
                          <option value="2">Companheiro</option>
                          <option value="3">Filhos</option>
                          <option value="4">Filho agregado (maior)</option>
                        </Select>
                      </FormControl>
                    </Flex>

                    <Flex gap={6}>
                      <FormControl>
                        <FormLabel>Celular</FormLabel>
                        <InputMask
                          mask="(99) 99999-9999"
                          variant="filled"
                          name="dep4_celular"
                          value={formValues.dep4_celular}
                          onChange={handleInputChange}
                        >
                          {(inputProps) => <Input {...inputProps} />}
                        </InputMask>
                      </FormControl>
                      <FormControl>
                        <FormLabel>CNS</FormLabel>
                        <Input
                          variant="filled"
                          name="dep4_cns"
                          value={formValues.dep4_cns}
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                  </TabPanel>
                </motion.div>
              </AnimatePresence>
            </TabPanels>
          </Tabs>
        </FormControl>
      </Stack>

      <Flex
        position={"fixed"}
        gap={6}
        bottom={"4vh"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        {currentStep !== 0 && (
          <Button
            colorScheme="gray"
            variant="outline"
            onClick={handlePreviousStep}
          >
            Retornar
          </Button>
        )}

        {currentStep !== nextStep ? (
          <Button colorScheme="whatsapp" onClick={handleNextStep}>
            Avançar
          </Button>
        ) : (
          <Button colorScheme="whatsapp" onClick={enviarFormulario}>
            Enviar
          </Button>
        )}
        <IconButton
          aria-label="toggle theme"
          rounded="full"
          size="md"
          position="fixed"
          bottom={4}
          left={4}
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
        />
      </Flex>

      {loading && (
        <Flex justifyContent="center">
          <CircularProgress isIndeterminate color="blue.300" />
        </Flex>
      )}
    </Flex>
  );
};

export default IndexPage;
