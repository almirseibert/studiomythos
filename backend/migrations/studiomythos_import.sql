-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: sites_digitalplussmysql:3306
-- Tempo de geração: 29/06/2026 às 19:47
-- Versão do servidor: 9.7.1
-- Versão do PHP: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `digitalplussmysql`
--
-- CREATE DATABASE IF NOT EXISTS `studiomythos` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `studiomythos`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `clientes`
--

CREATE TABLE `clientes` (
  `id` int NOT NULL,
  `nome` varchar(120) DEFAULT NULL,
  `empresa` varchar(150) DEFAULT NULL,
  `email` varchar(120) DEFAULT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `origem` varchar(40) DEFAULT 'Site',
  `categoria` varchar(80) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `cidade` varchar(120) DEFAULT NULL,
  `estado` varchar(80) DEFAULT NULL,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  `possui_website` tinyint DEFAULT NULL,
  `website_url` varchar(255) DEFAULT NULL,
  `osm_ref` varchar(60) DEFAULT NULL,
  `status` varchar(40) DEFAULT 'Novo',
  `vendedor_id` int DEFAULT NULL,
  `valor_estimado` decimal(10,2) DEFAULT '0.00',
  `titulo` varchar(150) DEFAULT NULL,
  `observacoes` text,
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `produto_oferecido` varchar(255) DEFAULT NULL,
  `valor_proposta` decimal(10,2) DEFAULT '0.00',
  `servicos_oferecidos` text,
  `contatos` text,
  `detalhes_externos` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `clientes`
--

INSERT INTO `clientes` (`id`, `nome`, `empresa`, `email`, `telefone`, `origem`, `categoria`, `endereco`, `cidade`, `estado`, `latitude`, `longitude`, `possui_website`, `website_url`, `osm_ref`, `status`, `vendedor_id`, `valor_estimado`, `titulo`, `observacoes`, `data_criacao`, `atualizado_em`, `produto_oferecido`, `valor_proposta`, `servicos_oferecidos`, `contatos`, `detalhes_externos`) VALUES
(17, 'Salão de Beleza AN Beauty', 'Salão de Beleza AN Beauty', '', '(55) 3028-4788', 'Prospecção', 'Salão de Beleza', 'R. Barão do Triunfo, 1494 - Nossa Sra. do Rosario, Santa Maria - RS, 97015-070', 'Santa Maria', 'RS', -29.6922131, -53.8146289, 0, '', 'google/ChIJ2x3NnVHLA5UROQd_u7sQDeQ', 'Novo', 1, 0.00, 'Website para Salão de Beleza AN Beauty', NULL, '2026-06-22 11:39:52', '2026-06-22 11:39:52', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3028-4788\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (94 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 09:00 – 19:00 · quarta-feira: 09:00 – 19:00 · quinta-feira: 09:00 – 19:00 · sexta-feira: 09:00 – 19:00 · sábado: 09:00 – 19:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3028-4788\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=16432809013835401017&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(18, 'ENCRESPANDO SG', 'ENCRESPANDO SG', '', '(55) 99214-0877', 'Prospecção', 'Salão de Beleza', 'R. Floriano Peixoto, 237 - Centro, Santa Maria - RS, 97010-310', 'Santa Maria', 'RS', -29.6797024, -53.8112629, 0, '', 'google/ChIJTX6VbfrLA5URPpBOSmNIFuY', 'Novo', 1, 0.00, 'Website para ENCRESPANDO SG', NULL, '2026-06-22 11:39:53', '2026-06-22 11:39:53', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 99214-0877\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (61 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 14:00 – 18:00 · quarta-feira: 09:30 – 18:00 · quinta-feira: 09:30 – 18:00 · sexta-feira: 09:30 – 19:00 · sábado: 09:00 – 19:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 99214-0877\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=16579518669496684606&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(19, 'Fast Escova Santa Maria', 'Fast Escova Santa Maria', '', '(55) 99233-6116', 'Prospecção', 'Salão de Beleza', 'R. Dr. Alberto Pasqualini, 35 - Loja B - Centro, Santa Maria - RS, 97015-010', 'Santa Maria', 'RS', -29.6876880, -53.8083945, 0, '', 'google/ChIJaxCZgTDLA5URizpSlls53qk', 'Novo', 1, 0.00, 'Website para Fast Escova Santa Maria', NULL, '2026-06-22 11:39:53', '2026-06-22 11:39:53', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 99233-6116\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,3 ★ (83 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 19:00 · terça-feira: 08:00 – 19:00 · quarta-feira: 08:00 – 19:00 · quinta-feira: 08:00 – 19:00 · sexta-feira: 08:00 – 20:00 · sábado: 08:00 – 20:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 99233-6116\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=12240283902766365323&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(20, 'Terezinha Beauty', 'Terezinha Beauty', '', '(55) 3221-5982', 'Prospecção', 'Salão de Beleza', 'R. Felipe de Oliveira, 234 - Sala 2 - Centro, Santa Maria - RS, 97015-250', 'Santa Maria', 'RS', -29.6957588, -53.8091378, 0, '', 'google/ChIJf8ifQG7LA5URDl8pdzauII8', 'Novo', 1, 0.00, 'Website para Terezinha Beauty', NULL, '2026-06-22 11:39:54', '2026-06-22 11:39:54', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3221-5982\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,9 ★ (168 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 13:30 – 19:00 · terça-feira: 08:30 – 19:00 · quarta-feira: 08:30 – 19:00 · quinta-feira: 08:30 – 19:00 · sexta-feira: 08:30 – 19:00 · sábado: 08:30 – 19:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3221-5982\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10313434695629102862&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(21, 'SALIEZA Estúdio', 'SALIEZA Estúdio', '', '(55) 99710-6353', 'Prospecção', 'Loja', 'R. Silva Jardim, 1324 - Rosário, Santa Maria - RS, 97010-493', 'Santa Maria', 'RS', -29.6840169, -53.8129863, 0, '', 'google/ChIJq_PyTCvLA5UR9KYaACxDtYE', 'Novo', 1, 0.00, 'Website para SALIEZA Estúdio', NULL, '2026-06-22 11:39:54', '2026-06-22 11:39:54', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 99710-6353\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"5,0 ★ (23 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Loja\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 13:00 – 18:00 · terça-feira: 08:00 – 18:00 · quarta-feira: 08:00 – 18:00 · quinta-feira: 08:00 – 18:00 · sexta-feira: 08:00 – 18:00 · sábado: 08:00 – 18:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 99710-6353\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=9346450457936701172&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(22, 'Lucimar Casagrande Cabeleireiros', 'Lucimar Casagrande Cabeleireiros', '', '(55) 3026-0003', 'Prospecção', 'Salão de Beleza', 'R. Pinheiro Machado, 2837 - Centro, Santa Maria - RS, 97050-601', 'Santa Maria', 'RS', -29.6886275, -53.8024593, 0, '', 'google/ChIJnV9sUmjLA5URiE91VorsOi4', 'Novo', 1, 0.00, 'Website para Lucimar Casagrande Cabeleireiros', NULL, '2026-06-22 11:39:55', '2026-06-22 11:39:55', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3026-0003\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (151 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 13:30 – 20:00 · terça-feira: 09:00 – 20:00 · quarta-feira: 09:00 – 20:00 · quinta-feira: 09:00 – 20:00 · sexta-feira: 09:00 – 20:00 · sábado: 09:00 – 20:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3026-0003\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=3331234953294073736&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(23, 'DCastro Prime Casa de Beleza', 'DCastro Prime Casa de Beleza', '', '(55) 3221-8865', 'Prospecção', 'Salão de Beleza', 'R. Dr. José Mariano da Rocha, 234 - Nossa Sra. de Lourdes, Santa Maria - RS, 97060-180', 'Santa Maria', 'RS', -29.6957433, -53.7989215, 0, '', 'google/ChIJyVWzbo6vA5URWXx8oc-T5Xs', 'Novo', 1, 0.00, 'Website para DCastro Prime Casa de Beleza', NULL, '2026-06-22 11:39:55', '2026-06-22 11:39:55', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3221-8865\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,9 ★ (16 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 09:00 – 19:00 · terça-feira: 09:00 – 19:00 · quarta-feira: 09:00 – 19:00 · quinta-feira: 09:00 – 19:00 · sexta-feira: 09:00 – 19:00 · sábado: 09:00 – 19:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3221-8865\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=8927704356308679769&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(24, 'GABTAI SALON by Tainá e Gabriel', 'GABTAI SALON by Tainá e Gabriel', '', '(55) 98129-1170', 'Prospecção', 'Salão de Beleza', 'R. dos Andradas, 1222 - Centro, Santa Maria - RS, 97010-030', 'Santa Maria', 'RS', -29.6857790, -53.8145627, 0, '', 'google/ChIJi6zwFmTLA5URPTUI0-7aePw', 'Novo', 1, 0.00, 'Website para GABTAI SALON by Tainá e Gabriel', NULL, '2026-06-22 11:39:56', '2026-06-22 11:39:56', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 98129-1170\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (51 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Salão de Beleza\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 09:00 – 20:30 · quarta-feira: 09:00 – 21:30 · quinta-feira: 09:00 – 21:30 · sexta-feira: 09:00 – 22:00 · sábado: 09:00 – 22:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 98129-1170\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=18192531414040720701&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(25, 'Consulting - Medicina do Trabalho', 'Consulting - Medicina do Trabalho', '', '(55) 3217-2007', 'Prospecção', 'Médico', 'R. Serafim Valandro, 1275 - Centro, Santa Maria - RS, 97015-631', 'Santa Maria', 'RS', -29.6913118, -53.8099357, 0, '', 'google/ChIJjd729mvLA5URKgXtQAocMdU', 'Novo', 1, 0.00, 'Website para Consulting - Medicina do Trabalho', NULL, '2026-06-22 11:39:56', '2026-06-22 11:39:56', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3217-2007\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,3 ★ (16 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Médico\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 12:00, 14:00 – 18:00 · terça-feira: 08:00 – 12:00, 14:00 – 18:00 · quarta-feira: 08:00 – 12:00, 14:00 – 18:00 · quinta-feira: 08:00 – 12:00, 14:00 – 18:00 · sexta-feira: 08:00 – 12:00, 14:00 – 18:00 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3217-2007\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=15362090634301998378&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(26, 'Neurolab Diagnóstico', 'Neurolab Diagnóstico', '', '(55) 3026-5490', 'Prospecção', 'Laboratório médico', 'R. Tuiuti, 1732 - sala2 - Centro, Santa Maria - RS, 97015-512', 'Santa Maria', 'RS', -29.6899371, -53.8076426, 0, '', 'google/ChIJae_eemTLA5UR_easZoqIILc', 'Contactado', 1, 0.00, 'Website para Neurolab Diagnóstico', NULL, '2026-06-22 11:39:57', '2026-06-22 18:40:50', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3026-5490\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"3,4 ★ (16 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Laboratório médico\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 11:30, 13:30 – 18:00 · terça-feira: 08:00 – 11:30, 13:30 – 18:00 · quarta-feira: 08:00 – 11:30, 13:30 – 18:00 · quinta-feira: 08:00 – 11:30, 13:30 – 18:00 · sexta-feira: 08:00 – 11:30, 13:30 – 17:30 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3026-5490\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=13195697036205025021&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(27, 'Total Médica', 'Total Médica', '', '(55) 3223-9176', 'Prospecção', 'Médico', 'R. Paul Harris, 19 - Centro, Santa Maria - RS, 97015-480', 'Santa Maria', 'RS', -29.6915953, -53.8094941, 0, '', 'google/ChIJp_NfZmvLA5URL0y2h2Hvn1c', 'Contactado', 1, 0.00, 'Website para Total Médica', NULL, '2026-06-22 11:39:57', '2026-06-22 19:21:43', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3223-9176\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"3,6 ★ (73 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Médico\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 18:00 · terça-feira: 08:00 – 18:00 · quarta-feira: 08:00 – 18:00 · quinta-feira: 08:00 – 18:00 · sexta-feira: 08:00 – 18:00 · sábado: 08:00 – 12:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3223-9176\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=6314028404764462127&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(28, 'Clinirad - Radiologia digital, Ultrassonografia Obstétrica , Morfológica e Mamografia digital', 'Clinirad - Radiologia digital, Ultrassonografia Obstétrica , Morfológica e Mamografia digital', '', '(55) 99215-8491', 'Prospecção', 'Médico', 'Rua do Acampamento - quase esquina com - Avenida Nossa Sra. Medianeira, 731 - Centro, Santa Maria - RS, 97050-003', 'Santa Maria', 'RS', -29.6918609, -53.8024900, 0, '', 'google/ChIJR6V7yGzLA5URDwV74a6DEAM', 'Contactado', 1, 0.00, 'Website para Clinirad - Radiologia digital, Ultrassonografia Obstétrica , Morfológica e Mamografia digital', NULL, '2026-06-22 11:39:58', '2026-06-22 12:57:09', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 99215-8491\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,3 ★ (23 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Médico\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 12:00, 14:00 – 17:30 · terça-feira: 08:00 – 12:00, 14:00 – 17:30 · quarta-feira: 08:00 – 12:00, 14:00 – 17:30 · quinta-feira: 08:00 – 12:00, 14:00 – 17:30 · sexta-feira: 08:00 – 12:00, 14:00 – 17:30 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 99215-8491\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=220821168871638287&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(29, 'Assistencial Santa Maria', 'Assistencial Santa Maria', '', '(55) 3213-4406', 'Prospecção', 'Centro médico', 'R. Duque de Caxias, 1668 - 101 - Centro, Santa Maria - RS, 97015-190', 'Santa Maria', 'RS', -29.6924020, -53.8112021, 0, '', 'google/ChIJe2k7ymjLA5URumzehPypBYw', 'Contactado', 1, 0.00, 'Website para Assistencial Santa Maria', NULL, '2026-06-22 11:39:58', '2026-06-22 18:37:30', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(55) 3213-4406\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (12 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Centro médico\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 09:00 – 12:00, 13:30 – 18:00 · terça-feira: 09:00 – 12:00, 13:30 – 18:00 · quarta-feira: 09:00 – 12:00, 13:30 – 18:00 · quinta-feira: 09:00 – 12:00, 13:30 – 18:00 · sexta-feira: 09:00 – 12:00, 13:30 – 18:00 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(55) 3213-4406\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10089657442219486394&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(30, 'Galpão Ventania Carnes Assadas', 'Galpão Ventania Carnes Assadas', '', '(41) 3232-1799', 'Prospecção', 'Restaurante', 'Rua Francisco Dallalibera, 1539 - Santa Felicidade, Curitiba - PR, 82030-290', 'Curitiba', 'PR', -25.3927249, -49.3341669, 0, '', 'google/ChIJPcTsU03g3JQRrIhHwXXwxMI', 'Novo', NULL, 0.00, 'Website para Galpão Ventania Carnes Assadas', NULL, '2026-06-26 18:27:31', '2026-06-26 18:27:31', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 3232-1799\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (2679 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Resumo\",\"valor\":\"Steakhouse informal tem boemia descontraída e serve carnes nobres no braseiro com guarnições tradicionais.\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:00 – 23:00 · terça-feira: 11:00 – 23:00 · quarta-feira: 11:00 – 23:00 · quinta-feira: 11:00 – 23:00 · sexta-feira: 11:00 – 23:00 · sábado: 11:00 – 23:00 · domingo: 10:30 – 16:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 3232-1799\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=14034606727337838764&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(31, 'Danilus Dog', 'Danilus Dog', '', '(41) 98808-4961', 'Prospecção', 'Cachorro-quente', 'Rua Francisco Dallalibera, 1709 - Santa Felicidade, Curitiba - PR, 82410-030', 'Curitiba', 'PR', -25.3925620, -49.3361172, 0, '', 'google/ChIJ7YmHP03g3JQR2XQv3M33ZxQ', 'Novo', NULL, 0.00, 'Website para Danilus Dog', NULL, '2026-06-26 18:27:32', '2026-06-26 18:27:32', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 98808-4961\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (642 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Cachorro-quente\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 18:00 – 22:00 · terça-feira: 18:00 – 22:00 · quarta-feira: 18:30 – 22:00 · quinta-feira: 18:00 – 22:00 · sexta-feira: 18:00 – 22:30 · sábado: 18:30 – 22:30 · domingo: 18:00 – 22:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 98808-4961\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=1470416266894210265&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(32, 'Bar do Breno', 'Bar do Breno', '', '(41) 99836-0354', 'Prospecção', 'Bar', 'R. Ângelo Stival, 1 - Santa Felicidade, Curitiba - PR, 82400-080', 'Curitiba', 'PR', -25.3983489, -49.3409093, 0, '', 'google/ChIJWwYqabTh3JQRtS4nNRt0j5g', 'Novo', NULL, 0.00, 'Website para Bar do Breno', NULL, '2026-06-26 18:27:32', '2026-06-26 18:27:32', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 99836-0354\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,4 ★ (50 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 09:00 – 05:00 · terça-feira: 09:00 – 05:00 · quarta-feira: 09:00 – 05:00 · quinta-feira: 09:00 – 05:00 · sexta-feira: 09:00 – 05:00 · sábado: 09:00 – 05:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 99836-0354\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10993132875639369397&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(33, 'Gibinha Lanches', 'Gibinha Lanches', '', '(41) 99537-7718', 'Prospecção', 'Lanchonete', 'Av. Manoel Ribas, 8372 - Butiatuvinha, Curitiba - PR, 82400-290', 'Curitiba', 'PR', -25.3939070, -49.3490726, 0, '', 'google/ChIJ69cEFDTg3JQR7qLvZDUFPP0', 'Novo', NULL, 0.00, 'Website para Gibinha Lanches', NULL, '2026-06-26 18:27:33', '2026-06-26 18:27:33', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 99537-7718\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (55 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 18:00 – 23:00 · terça-feira: 18:00 – 23:00 · quarta-feira: 18:00 – 23:00 · quinta-feira: 18:00 – 23:00 · sexta-feira: 18:00 – 23:00 · sábado: 18:00 – 23:00 · domingo: 18:00 – 23:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 99537-7718\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=18247465517083239150&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(34, 'Lanchonete Cachorrão Lanches e Porções', 'Lanchonete Cachorrão Lanches e Porções', '', '(41) 99708-2460', 'Prospecção', 'Lanchonete', 'Rua João Reffo, 177 - Santa Felicidade, Curitiba - PR, 82410-000', 'Curitiba', 'PR', -25.3908955, -49.3353582, 0, '', 'google/ChIJde18p-bh3JQRuXOrzb9wQgU', 'Novo', NULL, 0.00, 'Website para Lanchonete Cachorrão Lanches e Porções', NULL, '2026-06-26 18:27:33', '2026-06-26 18:27:33', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 99708-2460\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"5,0 ★ (7 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 09:00 – 23:00 · terça-feira: 09:00 – 23:00 · quarta-feira: 09:00 – 23:00 · quinta-feira: 09:00 – 23:00 · sexta-feira: 09:00 – 23:00 · sábado: 14:30 – 23:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 99708-2460\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=378989287744172985&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(35, 'Comida Chinesa Curitiba Wok China Santa Felicidade', 'Comida Chinesa Curitiba Wok China Santa Felicidade', '', '(41) 3297-3030', 'Prospecção', 'Restaurante chinês', 'R. Via Veneto, 1058 - Santa Felicidade, Curitiba - PR, 82020-470', 'Curitiba', 'PR', -25.4018344, -49.3281181, 0, '', 'google/ChIJQ2LYRqbh3JQRu-leC0hJasg', 'Novo', NULL, 0.00, 'Website para Comida Chinesa Curitiba Wok China Santa Felicidade', NULL, '2026-06-26 18:27:34', '2026-06-26 18:27:34', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 3297-3030\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (58 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Resumo\",\"valor\":\"Casa especializada na entrega de pratos chineses, como rolinhos primavera, frango xadrez, yakisobas e  tofu.\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante chinês\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 18:30 – 21:00 · terça-feira: 18:30 – 21:00 · quarta-feira: 18:30 – 21:00 · quinta-feira: Fechado · sexta-feira: 18:30 – 21:00 · sábado: 11:30 – 15:00, 18:30 – 21:00 · domingo: 11:30 – 15:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 3297-3030\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=14441435728894159291&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(36, 'Lanchonete e Pastelaria Vêneto', 'Lanchonete e Pastelaria Vêneto', '', '', 'Prospecção', 'Restaurante fast-food', 'R. Via Veneto, 1169 - Santa Felicidade, Curitiba - PR, 83535-470', 'Curitiba', 'PR', -25.4018412, -49.3294327, 0, '', 'google/ChIJ3xTEu77h3JQRztt7CDU1bnY', 'Novo', NULL, 0.00, 'Website para Lanchonete e Pastelaria Vêneto', NULL, '2026-06-26 18:27:34', '2026-06-26 18:27:34', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (6 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante fast-food\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=8533816845805542350&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(37, 'Lanchonete Texas Lanches', 'Lanchonete Texas Lanches', '', '(41) 3297-4066', 'Prospecção', 'Lanchonete', 'Rua 28 de Outubro, 109 - Santa Felicidade, Curitiba - PR, 82020-570', 'Curitiba', 'PR', -25.4012571, -49.3254663, 0, '', 'google/ChIJ68hrkqfh3JQRedTohnSG3ic', 'Novo', NULL, 0.00, 'Website para Lanchonete Texas Lanches', NULL, '2026-06-26 18:27:35', '2026-06-26 18:27:35', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(41) 3297-4066\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"5,0 ★ (10 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(41) 3297-4066\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=2872881447346689145&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(38, 'Churrascaria Boi e Brasa', 'Churrascaria Boi e Brasa', '', '(51) 3714-5144', 'Prospecção', 'Restaurante', '347, BR-386, 1135 - Alto do Parque, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4585487, -51.9560036, 0, '', 'google/ChIJt-rxeV5hHJURiZNSAkblTJI', 'Novo', NULL, 0.00, 'Website para Churrascaria Boi e Brasa', NULL, '2026-06-29 11:50:42', '2026-06-29 11:50:42', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3714-5144\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,4 ★ (1874 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Resumo\",\"valor\":\"Restaurante casual e familiar que serve o churrasco tradicional de cortes nobres com self-service apurado.\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 06:30 – 14:00, 18:00 – 22:00 · terça-feira: 06:30 – 14:00, 18:00 – 22:00 · quarta-feira: 06:30 – 14:00, 18:00 – 22:00 · quinta-feira: 06:30 – 14:00, 18:00 – 22:00 · sexta-feira: 06:30 – 14:00 · sábado: 06:30 – 14:00 · domingo: 06:30 – 14:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3714-5144\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10542052916616926089&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(39, 'Restaurante Bifão', 'Restaurante Bifão', '', '(51) 3714-2777', 'Prospecção', 'Restaurante', 'R. Alberto Torres, 416 - Centro, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4641603, -51.9657101, 0, '', 'google/ChIJAQAAAGNhHJURNKEfhDyF4Us', 'Novo', NULL, 0.00, 'Website para Restaurante Bifão', NULL, '2026-06-29 11:50:42', '2026-06-29 11:50:42', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3714-2777\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (2446 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 10:30 – 14:00 · terça-feira: 10:30 – 14:00 · quarta-feira: 10:30 – 14:00, 19:00 – 22:30 · quinta-feira: 10:30 – 14:00, 19:00 – 22:30 · sexta-feira: 10:30 – 14:00, 19:00 – 22:30 · sábado: 10:30 – 14:00, 19:00 – 22:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3714-2777\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=5467797917565690164&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(40, 'Churrascaria Trevo', 'Churrascaria Trevo', '', '(51) 3707-0252', 'Prospecção', 'Churrascaria', 'Whatsapp 51 996695348 - Av. Benjamin Constant, 2452 - Florestal, Lajeado - RS, 95900-702', 'Lajeado', 'RS', -29.4535060, -51.9747268, 0, '', 'google/ChIJD39gbXRhHJURs3fNB8TLgP4', 'Novo', NULL, 0.00, 'Website para Churrascaria Trevo', NULL, '2026-06-29 11:50:43', '2026-06-29 11:50:43', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3707-0252\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (678 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Churrascaria\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 07:00 – 14:30 · terça-feira: 07:00 – 14:30 · quarta-feira: 07:00 – 14:30 · quinta-feira: 07:00 – 14:30 · sexta-feira: 07:00 – 14:30 · sábado: 07:00 – 14:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3707-0252\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=18338881725457594291&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(41, 'Meu Escritório Gourmet', 'Meu Escritório Gourmet', '', '(51) 3790-3333', 'Prospecção', 'Restaurante', 'Av. Piraí, 196 - São Cristóvão, Lajeado - RS, 95913-148', 'Lajeado', 'RS', -29.4467646, -51.9661506, 0, '', 'google/ChIJeZ0E1BJhHJURycCcz1bstUo', 'Novo', NULL, 0.00, 'Website para Meu Escritório Gourmet', NULL, '2026-06-29 11:50:43', '2026-06-29 11:50:43', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3790-3333\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (1183 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Resumo\",\"valor\":\"Petiscos, refeições e bebidas alcoólicas em espaço relaxado e familiar com mezanino, varanda e música ao vivo.\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:15 – 13:45 · terça-feira: 11:15 – 13:45, 18:30 – 00:00 · quarta-feira: 11:15 – 13:45, 18:30 – 00:00 · quinta-feira: 11:15 – 13:45, 18:30 – 00:00 · sexta-feira: 11:15 – 13:45, 18:30 – 00:00 · sábado: 11:15 – 13:45, 18:30 – 00:00 · domingo: 11:15 – 13:45, 18:30 – 23:30\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3790-3333\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=5383468787185795273&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(42, 'Farol Lanches', 'Farol Lanches', '', '(51) 3748-3869', 'Prospecção', 'Lanchonete', 'Av. Senador Alberto Pasqualini, 485 - Centro, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4565001, -51.9670769, 0, '', 'google/ChIJn8cc7W9hHJURPDiTHRJCdBI', 'Novo', NULL, 0.00, 'Website para Farol Lanches', NULL, '2026-06-29 11:50:44', '2026-06-29 11:50:44', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3748-3869\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (477 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:00 – 13:30, 17:00 – 23:30 · terça-feira: 11:00 – 13:30, 17:00 – 23:30 · quarta-feira: 11:00 – 13:30, 17:00 – 23:30 · quinta-feira: 11:00 – 13:30, 17:00 – 23:30 · sexta-feira: 11:00 – 13:30, 17:00 – 23:30 · sábado: 11:00 – 23:30 · domingo: 18:00 – 23:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3748-3869\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=1329760435554170940&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(43, 'Cantina do Filé Centro', 'Cantina do Filé Centro', '', '(51) 99512-6848', 'Prospecção', 'Lanchonete', 'R. Carlos Von Koseritz, 452 - Centro, Lajeado - RS, 95900-012', 'Lajeado', 'RS', -29.4632873, -51.9653543, 0, '', 'google/ChIJX6NvWLJhHJURWpyREFKhrCU', 'Novo', NULL, 0.00, 'Website para Cantina do Filé Centro', NULL, '2026-06-29 11:50:44', '2026-06-29 11:50:44', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99512-6848\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,3 ★ (72 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 06:30 – 20:00 · terça-feira: 06:30 – 20:00 · quarta-feira: 06:30 – 20:00 · quinta-feira: 06:30 – 20:00 · sexta-feira: 06:30 – 20:00 · sábado: 06:30 – 13:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99512-6848\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=2714722049234934874&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(44, 'Dog Da Preta', 'Dog Da Preta', '', '(51) 99802-8117', 'Prospecção', 'Lanchonete', 'R. Vinte e Cinco de Julho, 14-52 - 14-52 - Americano, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4558037, -51.9674610, 0, '', 'google/ChIJqbHWxm9hHJURDREH2oC-IPs', 'Novo', NULL, 0.00, 'Website para Dog Da Preta', NULL, '2026-06-29 11:50:44', '2026-06-29 11:50:44', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99802-8117\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,3 ★ (347 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:00 – 14:00, 19:00 – 03:00 · terça-feira: 11:00 – 14:00, 19:00 – 03:00 · quarta-feira: 11:00 – 14:00, 19:00 – 03:00 · quinta-feira: 11:00 – 14:00, 19:00 – 03:00 · sexta-feira: 11:00 – 14:00, 19:00 – 03:00 · sábado: 11:00 – 14:00, 19:00 – 03:00 · domingo: 11:00 – 14:00, 19:00 – 03:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99802-8117\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=18095672763397640461&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(45, 'Churrasquinhos Do Tio Helio', 'Churrasquinhos Do Tio Helio', '', '(51) 3748-7430', 'Prospecção', 'Restaurante de churrasquinho', 'R. Mal. Deodoro, 256 - Centro, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4680638, -51.9624646, 0, '', 'google/ChIJiS19J99jHJUR02T7tEylwRw', 'Novo', NULL, 0.00, 'Website para Churrasquinhos Do Tio Helio', NULL, '2026-06-29 11:50:45', '2026-06-29 11:50:45', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3748-7430\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (553 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante de churrasquinho\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 10:00 – 14:00, 17:00 – 23:30 · terça-feira: 17:00 – 23:30 · quarta-feira: 10:00 – 14:00, 17:00 – 23:30 · quinta-feira: 10:00 – 14:00, 17:00 – 23:30 · sexta-feira: 10:00 – 14:00, 17:00 – 23:30 · sábado: 10:00 – 23:30 · domingo: 17:00 – 23:30\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3748-7430\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=2072119052439610579&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(46, 'Beer Dog Lanches', 'Beer Dog Lanches', '', '(51) 3748-4236', 'Prospecção', 'Lanchonete', 'R. Irmão Emílio Conrado, 29 - Florestal, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4573270, -51.9731222, 0, '', 'google/ChIJJTZP2XBhHJUREbQo0Ll8Dyc', 'Novo', NULL, 0.00, 'Website para Beer Dog Lanches', NULL, '2026-06-29 11:50:45', '2026-06-29 11:50:45', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3748-4236\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,4 ★ (229 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Lanchonete\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 10:30 – 23:00 · terça-feira: 10:30 – 23:00 · quarta-feira: 10:30 – 23:00 · quinta-feira: 10:30 – 23:00 · sexta-feira: 10:30 – 23:00 · sábado: 10:30 – 23:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3748-4236\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=2814605429632971793&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(47, 'Pão Quente Lajeado - Padaria, Confeitaria e Café', 'Pão Quente Lajeado - Padaria, Confeitaria e Café', '', '(51) 3714-4523', 'Prospecção', 'Padaria', 'R. Bento Gonçalves, 1083 - Centro, Lajeado - RS, 95900-026', 'Lajeado', 'RS', -29.4611448, -51.9651154, 0, '', 'google/ChIJ99z6cGRhHJUR_TuVY3Uzf5Y', 'Novo', NULL, 0.00, 'Website para Pão Quente Lajeado - Padaria, Confeitaria e Café', NULL, '2026-06-29 11:50:46', '2026-06-29 11:50:46', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3714-4523\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (684 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Padaria\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 06:30 – 19:30 · terça-feira: 06:30 – 19:30 · quarta-feira: 06:30 – 19:30 · quinta-feira: 06:30 – 19:30 · sexta-feira: 06:30 – 19:30 · sábado: 06:30 – 18:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3714-4523\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10844443007006358525&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(48, 'Posto de Combustíveis Moinhos Lajeado Ltda', 'Posto de Combustíveis Moinhos Lajeado Ltda', '', '(51) 3748-2684', 'Prospecção', 'Posto de combustível', 'R. Carlos Spohr Filho, 1520 - Moinhos, Lajeado - RS, 95901-034', 'Lajeado', 'RS', -29.4659918, -51.9805914, 0, '', 'google/ChIJKXfNlTdgHJURpWqCHWQr7fA', 'Novo', NULL, 0.00, 'Website para Posto de Combustíveis Moinhos Lajeado Ltda', NULL, '2026-06-29 11:50:46', '2026-06-29 11:50:46', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3748-2684\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,4 ★ (56 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Posto de combustível\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 06:00 – 21:40 · terça-feira: 06:00 – 21:40 · quarta-feira: 06:00 – 21:40 · quinta-feira: 06:00 – 21:40 · sexta-feira: 06:00 – 21:40 · sábado: 06:00 – 21:40 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3748-2684\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=17360579847574940325&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(49, 'Durga - Culinária Vegana & Café', 'Durga - Culinária Vegana & Café', '', '(51) 99366-3127', 'Prospecção', 'Restaurante vegano', 'R. Bento Gonçalves, 808 - Centro, Lajeado - RS, 95900-174', 'Lajeado', 'RS', -29.4635141, -51.9639718, 0, '', 'google/ChIJ2WVg8qdhHJURq160WazCskw', 'Novo', NULL, 0.00, 'Website para Durga - Culinária Vegana & Café', NULL, '2026-06-29 11:50:47', '2026-06-29 11:50:47', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99366-3127\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,9 ★ (256 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante vegano\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:45 – 17:30 · terça-feira: 11:45 – 17:30 · quarta-feira: 11:45 – 17:30 · quinta-feira: 11:44 – 17:30 · sexta-feira: 11:45 – 17:30 · sábado: 11:45 – 17:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Opções vegetarianas\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99366-3127\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=5526693738232176299&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]');
INSERT INTO `clientes` (`id`, `nome`, `empresa`, `email`, `telefone`, `origem`, `categoria`, `endereco`, `cidade`, `estado`, `latitude`, `longitude`, `possui_website`, `website_url`, `osm_ref`, `status`, `vendedor_id`, `valor_estimado`, `titulo`, `observacoes`, `data_criacao`, `atualizado_em`, `produto_oferecido`, `valor_proposta`, `servicos_oferecidos`, `contatos`, `detalhes_externos`) VALUES
(50, 'Restaurante e lancheira Braseiro do Sul', 'Restaurante e lancheira Braseiro do Sul', '', '(51) 98272-4444', 'Prospecção', 'Restaurante', 'Rodovia ERS-130, 2305 - Santo Andre, Lajeado - RS, 95912-000', 'Lajeado', 'RS', -29.4413110, -51.9710824, 0, '', 'google/ChIJlZOoZIhhHJURGHRQEwp3OaI', 'Contactado', NULL, 0.00, 'Website para Restaurante e lancheira Braseiro do Sul', NULL, '2026-06-29 11:50:47', '2026-06-29 13:40:55', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 98272-4444\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"5,0 ★ (11 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Restaurante\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 06:00 – 21:00 · terça-feira: 06:00 – 21:00 · quarta-feira: 06:00 – 21:00 · quinta-feira: 06:00 – 21:00 · sexta-feira: 06:00 – 21:00 · sábado: 06:00 – 15:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 98272-4444\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=11689505192974251032&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(51, 'Café do Parque', 'Café do Parque', '', '(51) 99780-7616', 'Prospecção', 'Cafeteria', 'Av. Lourenço Mayer da Silva - Alto do Parque, Lajeado - RS, 95913-352', 'Lajeado', 'RS', -29.4558302, -51.9533087, 0, '', 'google/ChIJO-dpbmBhHJURqc1h9Fb90-Q', 'Contactado', NULL, 0.00, 'Website para Café do Parque', NULL, '2026-06-29 11:50:48', '2026-06-29 13:01:24', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99780-7616\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"5,0 ★ (6 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Cafeteria\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: Fechado · quarta-feira: Fechado · quinta-feira: Fechado · sexta-feira: 14:00 – 17:00 · sábado: 14:00 – 18:30 · domingo: 14:30 – 18:30\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99780-7616\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=16488801210642582953&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(52, 'Pura Empório Café, Mercado Saudável', 'Pura Empório Café, Mercado Saudável', '', '(51) 98226-5317', 'Prospecção', 'Loja', 'Av. Benjamin Constant, 760 - sala 103 - Centro, Lajeado - RS, 95900-106', 'Lajeado', 'RS', -29.4644490, -51.9664062, 0, '', 'google/ChIJa49CmGthHJURcsfrGIKnTYk', 'Contactado', NULL, 0.00, 'Website para Pura Empório Café, Mercado Saudável', NULL, '2026-06-29 11:50:48', '2026-06-29 13:29:36', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 98226-5317\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (65 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Loja\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:30 – 18:00 · terça-feira: 08:30 – 18:00 · quarta-feira: 08:30 – 18:00 · quinta-feira: 08:30 – 18:00 · sexta-feira: 08:30 – 18:00 · sábado: 09:00 – 12:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 98226-5317\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=9893748133608540018&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(53, 'Cafeteria do Teatro', 'Cafeteria do Teatro', '', '(51) 3714-7000', 'Prospecção', 'Cafeteria', '95914-014 - Av. Avelino Talini, 171 - 2 andar - Universitário, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4455235, -51.9534421, 0, '', 'google/ChIJTZxrL0FhHJURtyv46TEYmY0', 'Novo', NULL, 0.00, 'Website para Cafeteria do Teatro', NULL, '2026-06-29 11:50:49', '2026-06-29 11:50:49', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3714-7000\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (112 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Cafeteria\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 14:30 – 22:00 · terça-feira: 14:30 – 22:00 · quarta-feira: 14:30 – 22:00 · quinta-feira: 14:30 – 22:00 · sexta-feira: 14:30 – 22:00 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3714-7000\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=10203213033442388919&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(54, 'Café dos vales', 'Café dos vales', '', '(51) 99353-1905', 'Prospecção', 'Cafeteria', 'Av. Benjamin Constant, 881 - Centro, Lajeado - RS, 95900-010', 'Lajeado', 'RS', -29.4632277, -51.9665580, 0, '', 'google/ChIJAbHm3plhHJURMqH6N-g6KoQ', 'Perdido', NULL, 0.00, 'Website para Café dos vales', NULL, '2026-06-29 11:50:49', '2026-06-29 13:04:04', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99353-1905\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"3,0 ★ (3 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Cafeteria\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99353-1905\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=9523489131074330930&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(55, 'Supermercado Battisti', 'Supermercado Battisti', '', '(51) 99926-4948', 'Prospecção', 'Supermercado', 'R. Ana Judite Pitol, 45-109 - Moinhos d\'Água, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4513240, -52.0059206, 0, '', 'google/ChIJZeg95MVhHJURUN5G2vq3mMg', 'Novo', NULL, 0.00, 'Website para Supermercado Battisti', NULL, '2026-06-29 11:50:49', '2026-06-29 11:50:49', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99926-4948\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,7 ★ (577 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Supermercado\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 08:00 – 12:00, 14:00 – 20:00 · terça-feira: 08:00 – 12:00, 14:00 – 20:00 · quarta-feira: 08:00 – 12:00, 14:00 – 20:00 · quinta-feira: 08:00 – 12:00, 14:00 – 20:00 · sexta-feira: 08:00 – 12:00, 14:00 – 20:00 · sábado: 08:00 – 12:00, 14:00 – 20:00 · domingo: 08:00 – 12:00, 17:00 – 19:30\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99926-4948\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=14454505292077391440&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(56, 'Padaria e Confeitaria Florestal', 'Padaria e Confeitaria Florestal', '', '(51) 3710-1064', 'Prospecção', 'Padaria', 'R. Gen. Flores da Cunha, 33 - Florestal, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4554978, -51.9715687, 0, '', 'google/ChIJVWriCHFhHJURyj1Xi16cFB4', 'Perdido', NULL, 0.00, 'Website para Padaria e Confeitaria Florestal', NULL, '2026-06-29 11:50:50', '2026-06-29 12:56:53', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3710-1064\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (233 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Padaria\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 07:00 – 20:00 · terça-feira: 07:00 – 20:00 · quarta-feira: 07:00 – 20:00 · quinta-feira: 07:00 – 20:00 · sexta-feira: 07:00 – 20:00 · sábado: 07:00 – 19:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Serve café da manhã\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3710-1064\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=2167529250550660554&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(57, 'Mercado Passaia', 'Mercado Passaia', '', '(51) 3748-4889', 'Prospecção', 'Supermercado', 'R. Frederico Bertholdo Schneider, 70 - Universitário, Lajeado - RS, 95914-613', 'Lajeado', 'RS', -29.4378414, -51.9625857, 0, '', 'google/ChIJA7JOJRdhHJUR5BF2LgPC8lg', 'Contactado', NULL, 0.00, 'Website para Mercado Passaia', NULL, '2026-06-29 11:50:50', '2026-06-29 12:55:04', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3748-4889\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (158 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Supermercado\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 07:30 – 12:00, 14:00 – 20:00 · terça-feira: 07:30 – 12:00, 14:00 – 20:00 · quarta-feira: 07:30 – 12:00, 14:00 – 20:00 · quinta-feira: 07:30 – 12:00, 14:00 – 20:00 · sexta-feira: 07:30 – 12:00, 14:00 – 20:00 · sábado: 07:30 – 12:00, 14:00 – 20:00 · domingo: 08:00 – 12:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3748-4889\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=6409398538621817316&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(58, 'Leopoldo 47', 'Leopoldo 47', '', '(51) 99352-5680', 'Prospecção', 'Bares', 'R. Leopoldo Sulzbach, 47 - Americano, Lajeado - RS, 95900-482', 'Lajeado', 'RS', -29.4553825, -51.9638865, 0, '', 'google/ChIJ9avO-3NhHJURZ_sw-f4GkUo', 'Novo', NULL, 0.00, 'Website para Leopoldo 47', NULL, '2026-06-29 11:50:50', '2026-06-29 11:50:50', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 99352-5680\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (1018 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bares\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 18:00 – 00:00 · quarta-feira: 18:00 – 00:00 · quinta-feira: 18:00 – 00:00 · sexta-feira: 18:00 – 00:00 · sábado: 18:00 – 00:00 · domingo: 18:00 – 00:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 99352-5680\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=5373083522601909095&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(59, 'Off Lounge', 'Off Lounge', '', '', 'Prospecção', 'Bar', 'R. Irena Haas Bergmann - Carneiros, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4474209, -51.9429054, 0, '', 'google/ChIJN1Ltb05hHJURI-AyNsvmkuw', 'Novo', NULL, 0.00, 'Website para Off Lounge', NULL, '2026-06-29 11:50:50', '2026-06-29 11:50:50', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (237 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: Fechado · quarta-feira: Fechado · quinta-feira: Fechado · sexta-feira: 18:00 – 02:00 · sábado: Fechado · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=17046941300012802083&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(60, 'Lupulado', 'Lupulado', '', '', 'Prospecção', 'Bar', 'Av. ACVAT - Americano, Lajeado - RS, 95900-530', 'Lajeado', 'RS', -29.4561061, -51.9658567, 0, '', 'google/ChIJW4AJZgBhHJURw57Ew-mhtqg', 'Novo', NULL, 0.00, 'Website para Lupulado', NULL, '2026-06-29 11:50:51', '2026-06-29 11:50:51', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (119 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 17:00 – 00:00 · quarta-feira: 17:00 – 00:00 · quinta-feira: 17:00 – 00:00 · sexta-feira: 17:00 – 00:00 · sábado: 17:00 – 00:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=12157082269517127363&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(61, 'Queen’s Lajeado | Pub & Eventos / Restaurante - Almoço Com Buffet.', 'Queen’s Lajeado | Pub & Eventos / Restaurante - Almoço Com Buffet.', '', '', 'Prospecção', 'Bar', 'R. Expedicionários do Brasil, 335 - Americano, Lajeado - RS, 95900-508', 'Lajeado', 'RS', -29.4556427, -51.9642527, 0, '', 'google/ChIJ6RatIp5hHJURHyW57_HmxC8', 'Novo', NULL, 0.00, 'Website para Queen’s Lajeado | Pub & Eventos / Restaurante - Almoço Com Buffet.', NULL, '2026-06-29 11:50:51', '2026-06-29 11:50:51', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,5 ★ (342 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$$ — moderado\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: 11:00 – 13:30, 18:00 – 00:00 · terça-feira: 11:00 – 13:30, 18:00 – 00:00 · quarta-feira: 11:00 – 13:30, 18:00 – 00:00 · quinta-feira: 11:00 – 13:30, 18:00 – 00:00 · sexta-feira: 11:00 – 13:30, 18:00 – 00:00 · sábado: 18:00 – 00:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Para viagem\",\"valor\":\"Sim\"},{\"label\":\"Entrega (delivery)\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve almoço\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Opções vegetarianas\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Bom p/ crianças\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=3442129942001296671&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(62, 'Xirú Snooker Bar', 'Xirú Snooker Bar', '', '(51) 3709-3002', 'Prospecção', 'Bar esportivo', 'R. Saldanha Marinho, 254 - Centro, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4615441, -51.9652595, 0, '', 'google/ChIJ8fD6d2RhHJURNqmxYHE3NTU', 'Novo', NULL, 0.00, 'Website para Xirú Snooker Bar', NULL, '2026-06-29 11:50:51', '2026-06-29 11:50:51', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"(51) 3709-3002\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (519 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar esportivo\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: Fechado · quarta-feira: 18:00 – 02:00 · quinta-feira: 18:00 – 02:00 · sexta-feira: 18:00 – 02:00 · sábado: 16:00 – 02:00 · domingo: 16:00 – 02:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"(51) 3709-3002\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=3834031617868933430&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(63, 'Volúpia - Bar e Espaço Cultural', 'Volúpia - Bar e Espaço Cultural', '', '', 'Prospecção', 'Bar', 'R. Augusto Lange, 70 - Americano, Lajeado - RS, 95900-486', 'Lajeado', 'RS', -29.4534935, -51.9641111, 0, '', 'google/ChIJdZmrj3BhHJURihQR8LG1PVk', 'Novo', NULL, 0.00, 'Website para Volúpia - Bar e Espaço Cultural', NULL, '2026-06-29 11:50:51', '2026-06-29 11:50:51', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,6 ★ (306 avaliações)\"},{\"label\":\"Faixa de preço\",\"valor\":\"R$ — econômico\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: Fechado · quarta-feira: Fechado · quinta-feira: Fechado · sexta-feira: 21:00 – 02:00 · sábado: 23:30 – 04:30 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Estacionamento acessível\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=6430495618796426378&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(64, 'Safe gastro lounge', 'Safe gastro lounge', '', '980 297 507', 'Prospecção', 'Gastropub', 'Av. Avelino Talini, 246 - Universitário, Lajeado - RS, 95914-014', 'Lajeado', 'RS', -29.4428263, -51.9571070, 0, '', 'google/ChIJgdqnq1RhHJURJS7y1a_v9Dw', 'Novo', NULL, 0.00, 'Website para Safe gastro lounge', NULL, '2026-06-29 11:50:51', '2026-06-29 11:50:51', NULL, 0.00, NULL, '[{\"nome\":\"Contato principal\",\"telefone\":\"980 297 507\",\"email\":\"\"}]', '[{\"label\":\"Avaliação\",\"valor\":\"4,1 ★ (126 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Gastropub\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: 18:00 – 00:00 · quarta-feira: 18:00 – 00:00 · quinta-feira: 18:00 – 00:00 · sexta-feira: 18:00 – 00:00 · sábado: 18:00 – 00:00 · domingo: 18:00 – 00:00\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Aceita reservas\",\"valor\":\"Sim\"},{\"label\":\"Serve jantar\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Acessível p/ cadeirantes\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Telefone\",\"valor\":\"980 297 507\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=4392399075080810021&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]'),
(65, 'Mangaia Lounge Bar', 'Mangaia Lounge Bar', '', '', 'Prospecção', 'Bar', 'Av. Décio Martins Costa, 160 - Hidráulica, Lajeado - RS, 95900-000', 'Lajeado', 'RS', -29.4607672, -51.9617210, 0, '', 'google/ChIJ6xy8KABhHJURMoNaKqHCuKg', 'Novo', NULL, 0.00, 'Website para Mangaia Lounge Bar', NULL, '2026-06-29 11:50:52', '2026-06-29 11:50:52', NULL, 0.00, NULL, '[]', '[{\"label\":\"Avaliação\",\"valor\":\"4,8 ★ (38 avaliações)\"},{\"label\":\"Categoria (Google)\",\"valor\":\"Bar\"},{\"label\":\"Horários\",\"valor\":\"segunda-feira: Fechado · terça-feira: Fechado · quarta-feira: 18:00 – 00:00 · quinta-feira: 18:00 – 00:00 · sexta-feira: 18:00 – 00:00 · sábado: 18:00 – 00:00 · domingo: Fechado\"},{\"label\":\"Aberto agora\",\"valor\":\"Não\"},{\"label\":\"Refeição no local\",\"valor\":\"Sim\"},{\"label\":\"Serve cerveja\",\"valor\":\"Sim\"},{\"label\":\"Serve vinho\",\"valor\":\"Sim\"},{\"label\":\"Pagamentos\",\"valor\":\"crédito, débito, aproximação (NFC)\"},{\"label\":\"Ver no Google Maps\",\"valor\":\"https://maps.google.com/?cid=12157681191542752050&g_mp=Cilnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLlNlYXJjaE5lYXJieRACGAQgAA\"}]');

-- --------------------------------------------------------

--
-- Estrutura para tabela `curriculos`
--

CREATE TABLE `curriculos` (
  `id` int NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(40) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL,
  `cpf` varchar(20) DEFAULT NULL,
  `rg` varchar(20) DEFAULT NULL,
  `sexo` varchar(20) DEFAULT NULL,
  `estado_civil` varchar(30) DEFAULT NULL,
  `nacionalidade` varchar(60) DEFAULT NULL,
  `endereco` varchar(255) DEFAULT NULL,
  `cidade` varchar(120) DEFAULT NULL,
  `estado` varchar(60) DEFAULT NULL,
  `cep` varchar(15) DEFAULT NULL,
  `vaga_desejada` varchar(150) DEFAULT NULL,
  `pretensao_salarial` varchar(60) DEFAULT NULL,
  `disponibilidade` varchar(80) DEFAULT NULL,
  `escolaridade` varchar(80) DEFAULT NULL,
  `cnh` varchar(20) DEFAULT NULL,
  `possui_veiculo` tinyint DEFAULT '0',
  `linkedin` varchar(255) DEFAULT NULL,
  `portfolio` varchar(255) DEFAULT NULL,
  `experiencias` text,
  `formacoes` text,
  `cursos` text,
  `habilidades` text,
  `sobre` text,
  `origem` varchar(40) DEFAULT 'Site',
  `status` enum('Novo','Em análise','Entrevista','Aprovado','Reprovado') DEFAULT 'Novo',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `curriculos`
--

INSERT INTO `curriculos` (`id`, `nome`, `email`, `telefone`, `data_nascimento`, `cpf`, `rg`, `sexo`, `estado_civil`, `nacionalidade`, `endereco`, `cidade`, `estado`, `cep`, `vaga_desejada`, `pretensao_salarial`, `disponibilidade`, `escolaridade`, `cnh`, `possui_veiculo`, `linkedin`, `portfolio`, `experiencias`, `formacoes`, `cursos`, `habilidades`, `sobre`, `origem`, `status`, `data_criacao`) VALUES
(1, 'Daniele Schuck ', 'danieleschuck0@gmail.com', '51993020644', NULL, NULL, NULL, 'Feminino', 'Solteiro(a)', 'Brasileira', 'Rua Porto Alegre, 88', 'Lajeado', 'RS', '95914-702', 'Assistente comercial', '2400', 'A combinar', 'Técnico', 'AB', 1, NULL, NULL, '[{\"empresa\":\"Adn service\",\"cargo\":\"Assistente administrativo \",\"periodo\":\"2020/2022\",\"atividades\":\"Abahhdndn\"}]', '[{\"curso\":\"Técnico administração \",\"instituicao\":\"Senac\",\"nivel\":\"Tecnico\",\"ano\":\"2027\"}]', '[]', NULL, NULL, 'ALLBLACK MOTOS', 'Em análise', '2026-06-22 00:06:40');

-- --------------------------------------------------------

--
-- Estrutura para tabela `exclusoes_conta`
--

CREATE TABLE `exclusoes_conta` (
  `id` int NOT NULL,
  `app` varchar(60) NOT NULL DEFAULT 'meu-lava-rapido',
  `nome` varchar(120) NOT NULL,
  `email` varchar(120) NOT NULL,
  `motivo` text,
  `status` varchar(30) NOT NULL DEFAULT 'Pendente',
  `data_criacao` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `funcionarios`
--

CREATE TABLE `funcionarios` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `role_id` int DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `funcionarios`
--

INSERT INTO `funcionarios` (`id`, `nome`, `email`, `senha_hash`, `role_id`, `ativo`, `data_criacao`) VALUES
(1, 'Gestor Principal', 'almir.seibert@gmail.com', '$2a$12$WF1D9jYs88Gij9oo/zCnUeLTFJEJhqeUosIpYQlmUNQMvsA1zUoOy', 1, 1, '2026-04-21 17:20:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `interacoes`
--

CREATE TABLE `interacoes` (
  `id` int NOT NULL,
  `cliente_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `tipo` varchar(40) DEFAULT NULL,
  `descricao` text,
  `status_para` varchar(40) DEFAULT NULL,
  `mensagem_automatica` tinyint DEFAULT '0',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `interacoes`
--

INSERT INTO `interacoes` (`id`, `cliente_id`, `usuario_id`, `tipo`, `descricao`, `status_para`, `mensagem_automatica`, `data_criacao`) VALUES
(35, 17, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:52'),
(36, 18, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:53'),
(37, 19, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:53'),
(38, 20, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:54'),
(39, 21, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:54'),
(40, 22, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:55'),
(41, 23, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:55'),
(42, 24, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:56'),
(43, 25, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:56'),
(44, 26, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:57'),
(45, 27, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:57'),
(46, 28, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:58'),
(47, 29, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-22 11:39:58'),
(48, 28, 1, 'Ligação', 'Retornar a tarde e falar com Everton.', NULL, 0, '2026-06-22 12:56:05'),
(49, 28, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-22 12:57:09'),
(50, 28, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Clinirad - Radiologia digital, Ultrassonografia Obstétrica , Morfológica e Mamografia digital e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-22 12:57:09'),
(51, 29, 1, 'Ligação', 'numero nao programado para chamdas, e nao tem whats.', NULL, 0, '2026-06-22 18:37:24'),
(52, 29, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-22 18:37:30'),
(53, 29, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Assistencial Santa Maria e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-22 18:37:31'),
(54, 26, 1, 'Ligação', 'nao atendido', NULL, 0, '2026-06-22 18:40:44'),
(55, 26, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-22 18:40:50'),
(56, 26, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Neurolab Diagnóstico e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-22 18:40:50'),
(57, 27, 1, 'Ligação', 'sem contato', NULL, 0, '2026-06-22 19:21:29'),
(58, 27, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-22 19:21:43'),
(59, 27, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Total Médica e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-22 19:21:44'),
(60, 30, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:31'),
(61, 31, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:32'),
(62, 32, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:32'),
(63, 33, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:33'),
(64, 34, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:33'),
(65, 35, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:34'),
(66, 36, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:34'),
(67, 37, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-26 18:27:35'),
(68, 38, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:42'),
(69, 39, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:42'),
(70, 40, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:43'),
(71, 41, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:43'),
(72, 42, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:44'),
(73, 43, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:44'),
(74, 44, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:44'),
(75, 45, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:45'),
(76, 46, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:45'),
(77, 47, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:46'),
(78, 48, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:46'),
(79, 49, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:47'),
(80, 50, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:47'),
(81, 51, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:48'),
(82, 52, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:48'),
(83, 53, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:49'),
(84, 54, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:49'),
(85, 55, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:49'),
(86, 56, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:50'),
(87, 57, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:50'),
(88, 58, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:50'),
(89, 59, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:50'),
(90, 60, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:51'),
(91, 61, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:51'),
(92, 62, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:51'),
(93, 63, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:51'),
(94, 64, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:51'),
(95, 65, 1, 'Sistema', 'Lead captado via prospecção no mapa · oportunidade SEM SITE.', NULL, 0, '2026-06-29 11:50:52'),
(96, 57, 1, 'Ligação', 'Camili. 99846-4293\nliguei no telefone fixo , passaram contato ceular nao atendido.\ntentar enviar algo pelo whatsapp.', NULL, 0, '2026-06-29 12:55:02'),
(97, 57, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-29 12:55:04'),
(98, 57, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Mercado Passaia e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-29 12:55:05'),
(99, 56, 1, 'Ligação', 'não tem interesse', NULL, 0, '2026-06-29 12:56:45'),
(100, 56, 1, 'Status', 'Movido de \"Novo\" para \"Perdido\".', 'Perdido', 0, '2026-06-29 12:56:53'),
(101, 51, 1, 'Ligação', 'ligação cai', NULL, 0, '2026-06-29 13:01:21'),
(102, 51, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-29 13:01:24'),
(103, 51, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Café do Parque e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-29 13:01:24'),
(104, 54, 1, 'Status', 'Movido de \"Novo\" para \"Perdido\".', 'Perdido', 0, '2026-06-29 13:04:03'),
(105, 54, 1, 'Ligação', 'dentro hospital', NULL, 0, '2026-06-29 13:04:04'),
(106, 52, 1, 'Ligação', 'cx. mensagem.\n tentar retorno.', NULL, 0, '2026-06-29 13:29:30'),
(107, 52, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-29 13:29:36'),
(108, 52, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Pura Empório Café, Mercado Saudável e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-29 13:29:36'),
(109, 50, 1, 'Ligação', 'enviar pelo whats', NULL, 0, '2026-06-29 13:40:52'),
(110, 50, 1, 'Status', 'Movido de \"Novo\" para \"Contactado\".', 'Contactado', 0, '2026-06-29 13:40:55'),
(111, 50, 1, 'WhatsApp', 'Olá! Aqui é da Studio Mythos. Vi a Restaurante e lancheira Braseiro do Sul e gostaria de conversar sobre a presença digital de vocês. Tem um minuto? 🚀', NULL, 1, '2026-06-29 13:40:55');

-- --------------------------------------------------------

--
-- Estrutura para tabela `lancamentos`
--

CREATE TABLE `lancamentos` (
  `id` int NOT NULL,
  `data` date NOT NULL,
  `descricao` varchar(255) NOT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `tipo` varchar(20) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `status` varchar(20) DEFAULT 'PENDENTE',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `orcamentos`
--

CREATE TABLE `orcamentos` (
  `id` int NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefone` varchar(40) DEFAULT NULL,
  `tipo` varchar(80) DEFAULT 'Orçamento',
  `descricao` text,
  `dados` text,
  `valor_estimado` decimal(10,2) DEFAULT '0.00',
  `origem` varchar(40) DEFAULT 'Site',
  `status` enum('Novo','Em contato','Fechado','Cancelado') DEFAULT 'Novo',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `orcamentos`
--

INSERT INTO `orcamentos` (`id`, `nome`, `email`, `telefone`, `tipo`, `descricao`, `dados`, `valor_estimado`, `origem`, `status`, `data_criacao`) VALUES
(1, 'Almir', 'almir.seibert@gmail.com', '51983108144', 'Capacete personalizado', NULL, '{\"corBase\":\"#EC4899\",\"corBaseNome\":\"Rosa Pink\",\"viseira\":\"preta\",\"grafismo\":\"nenhum\",\"corGrafismo\":\"#FFFFFF\",\"corGrafismoNome\":\"Branco\",\"tamanho\":\"57-58\",\"modelo\":\"fechado\",\"resumo\":\"Capacete personalizado ALLBLACK\\n• Modelo: Fechado (Full Face)\\n• Cor base: Rosa Pink\\n• Viseira: Preta\\n• Grafismo: Sem grafismo\\n• Tamanho: 57/58 — M\\n• Valor estimado: R$ 650,00\",\"tamanhoNome\":\"57/58 — M\",\"modeloNome\":\"Fechado (Full Face)\",\"viseiraNome\":\"Preta\",\"grafismoNome\":\"Sem grafismo\"}', 650.00, 'Site', 'Em contato', '2026-06-22 00:01:42');

-- --------------------------------------------------------

--
-- Estrutura para tabela `roles`
--

CREATE TABLE `roles` (
  `id` int NOT NULL,
  `nome` varchar(50) NOT NULL,
  `permissoes` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `roles`
--

INSERT INTO `roles` (`id`, `nome`, `permissoes`) VALUES
(1, 'Administrador', '{\"crm\": true, \"financeiro\": true, \"configuracoes\": true}'),
(2, 'Consultor de Vendas', '{\"crm\": true, \"financeiro\": false, \"configuracoes\": false}');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `papel` enum('admin','vendedor') DEFAULT 'vendedor',
  `ativo` tinyint DEFAULT '1',
  `data_criacao` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `papel`, `ativo`, `data_criacao`) VALUES
(1, 'Almir Seibert', 'almir.seibert@gmail.com', '$2b$10$qHDYe1HCSkGk83tQxBex6eza1nS5a1S3CkIlHE4i7MYTy3uAVkQp.', 'admin', 1, '2026-06-14 14:45:59');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `osm_ref` (`osm_ref`),
  ADD KEY `vendedor_id` (`vendedor_id`);

--
-- Índices de tabela `curriculos`
--
ALTER TABLE `curriculos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `exclusoes_conta`
--
ALTER TABLE `exclusoes_conta`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- Índices de tabela `interacoes`
--
ALTER TABLE `interacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cliente_id` (`cliente_id`);

--
-- Índices de tabela `lancamentos`
--
ALTER TABLE `lancamentos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de tabela `curriculos`
--
ALTER TABLE `curriculos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `exclusoes_conta`
--
ALTER TABLE `exclusoes_conta`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `funcionarios`
--
ALTER TABLE `funcionarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `interacoes`
--
ALTER TABLE `interacoes`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=112;

--
-- AUTO_INCREMENT de tabela `lancamentos`
--
ALTER TABLE `lancamentos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `orcamentos`
--
ALTER TABLE `orcamentos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `clientes`
--
ALTER TABLE `clientes`
  ADD CONSTRAINT `clientes_ibfk_1` FOREIGN KEY (`vendedor_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `funcionarios`
--
ALTER TABLE `funcionarios`
  ADD CONSTRAINT `funcionarios_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL;

--
-- Restrições para tabelas `interacoes`
--
ALTER TABLE `interacoes`
  ADD CONSTRAINT `interacoes_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE;
--
-- Banco de dados: `digital_plus_crm`
--
-- CREATE DATABASE IF NOT EXISTS `digital_plus_crm` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE `digital_plus_crm`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
