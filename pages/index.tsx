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

const SourceFileUrl = "https://alexjsanches.github.io/monaiza/FIC+DS.pdf";
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
    tit_nome: "",
    tit_dn: "",
    tit_sexo: "",
    tit_estcivil: "",
    tit_nomemae: "",
    tit_nacionalidade: "Brasileiro",
    tit_ufnatural: "",
    tit_cidadenatural: "",
    tit_cep: "",
    tit_cidade: "",
    tit_uf: "",
    tit_logradouro: "",
    tit_numero: "",
    tit_complemento: "",
    tit_bairro: "",
    tit_celular: "",
    tit_email: "",
    tit_cpf: "",
    tit_rg: "",
    tit_emissor_rg: "",
    tit_dt_emissao: "",
    tit_dnv: "",
    tit_cns: "",
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
      { fieldName: "essencial_enf", value: formValues.plano === "X5" },
      { fieldName: "essencial_apt", value: formValues.plano === "X6" },
      { fieldName: "pontual_enf", value: formValues.plano === "X7" },
      { fieldName: "pontual_apt", value: formValues.plano === "X8" },
      { fieldName: "equilibrio_enf", value: formValues.plano === "X9" },
      { fieldName: "equilibrio_apt", value: formValues.plano === "X10" },
      { fieldName: "udiplan_enf", value: formValues.plano === "X11" },
      { fieldName: "udiplan_apt", value: formValues.plano === "X12" },
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

    const fieldValues = [
      { fieldName: "razao_social", value: formValues.razao_social },
      { fieldName: "cpf_cnpj", value: formValues.cpf_cnpj },
      { fieldName: "tit_nome", value: formValues.tit_nome },
      {
        fieldName: "tit_dn",
        value: formatDate("tit_dn", formValues.tit_dn).value,
      },
      { fieldName: "tit_sexo", value: formValues.tit_sexo === "M" ? "M" : "F" },
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
    ];

    // Preenche os campos do formulário
    const form = pdfDoc.getForm();

    // Preenchendo os campos de texto
    fieldValues.forEach((field) => {
      const textField = form.getTextField(field.fieldName);
      if (textField) {
        textField.setText(field.value);
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

  const handleSelectChange = (event) => {
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
                          onChange={handleSelectChange}
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
