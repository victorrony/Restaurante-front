import React, { useMemo, useState, useEffect } from "react";
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Box,
   TextField,
   FormControl,
   InputLabel,
   Select,
   MenuItem,
   IconButton,
   Button,
   Typography,
   Divider,
   Tooltip,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import GuestMealCard from "./GuestSelectionCard";
import GuestMealSummaryCard from "./GuestMealSummaryCard";
import { menuAPI } from "../../services/api";

type Category = "PRATOS" | "BEBIDAS" | "SOBREMESAS" | "OUTROS";
type BaseTipo = "ARROZ" | "SOPA";
type ProteinaTipo = "CARNE" | "PEIXE";
type AcompanhamentoTipo = "LEGUMES" | "SALADA";

// Real menu fetched from API
interface AdaptedMenuItem {
   id: string;
   name: string;
   price: number;
   category: Category;
}

interface OrderItemDraft {
   id: string;
   name: string;
   price: number;
   quantity: number;
   category: Category;
}

interface GuestSelection {
   id: number;
   base: BaseTipo;
   proteina: ProteinaTipo;
   acompanhamento: AcompanhamentoTipo;
   observacao?: string;
}

export interface NewOrderPayload {
   customerName: string;
   tableNumber: number;
   status: string;
   notes?: string;
   numberOfPeople: number;
   guests: GuestSelection[];
   items: OrderItemDraft[];
   totalAmount: number;
   summary: {
      base: Record<BaseTipo, number>;
      proteina: Record<ProteinaTipo, number>;
      acompanhamento: Record<AcompanhamentoTipo, number>;
      extrasCategoria: Record<string, number>; // <--- NOVO
      extrasItens: Record<string, number>;
   };
}

interface Props {
   open: boolean;
   onClose: () => void;
   onCreate: (data: NewOrderPayload) => void;
}

const NewOrderDialog: React.FC<Props> = ({ open, onClose, onCreate }) => {
   const [customerName, setCustomerName] = useState("");
   const [tableNumber, setTableNumber] = useState<number | "">("");
   const [status, setStatus] = useState("PENDENTE");
   const [notes, setNotes] = useState("");
   const [people, setPeople] = useState(1);

   // Por pessoa
   const [guests, setGuests] = useState<GuestSelection[]>([
      { id: 1, base: "ARROZ", proteina: "CARNE", acompanhamento: "LEGUMES" },
   ]);

   // Real menu items
   const [menuItems, setMenuItems] = useState<AdaptedMenuItem[]>([]);
   const [menuError, setMenuError] = useState<string | null>(null);

   // Extras selecionados (bebidas, sobremesas)
   const [items, setItems] = useState<OrderItemDraft[]>([]);

   useEffect(() => {
      const loadMenu = async () => {
         // optional loading state removed to avoid unused variable warning
         setMenuError(null);
         try {
            const data = await menuAPI.getMenuItems();
            const adapted: AdaptedMenuItem[] = data.map((m) => ({
               id: m.id,
               name: m.name,
               price: m.price,
               category: (m.category?.name?.toUpperCase() as Category) || "OUTROS",
            }));
            setMenuItems(adapted);
         } catch (e: any) {
            setMenuError(e?.response?.data?.message || e.message || "Falha ao carregar menu");
         } finally {
            /* no-op */
         }
      };
      loadMenu();
   }, []);

   // Auto ajustar quantidade de guests quando muda people
   React.useEffect(() => {
      setGuests((prev) => {
         if (people > prev.length) {
            const add: GuestSelection[] = [];
            for (let i = prev.length + 1; i <= people; i++) {
               add.push({
                  id: i,
                  base: "ARROZ",
                  proteina: "CARNE",
                  acompanhamento: "LEGUMES",
               });
            }
            return [...prev, ...add];
         } else {
            return prev.slice(0, people);
         }
      });
   }, [people]);

   const duplicateFirst = () => {
      if (!guests.length) return;
      const first = guests[0];
      setGuests(
         guests.map((g) => ({ ...g, base: first.base, proteina: first.proteina, acompanhamento: first.acompanhamento }))
      );
   };

   const updateGuest = (id: number, patch: Partial<GuestSelection>) => {
      setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
   };

   // (Seleção de extras desativada por enquanto; código removido para evitar warnings)

   // Resumo agregado
   const summary = useMemo(() => {
      const base: Record<BaseTipo, number> = { ARROZ: 0, SOPA: 0 };
      const proteina: Record<ProteinaTipo, number> = { CARNE: 0, PEIXE: 0 };
      const acompanhamento: Record<AcompanhamentoTipo, number> = { LEGUMES: 0, SALADA: 0 };
      const extrasCategoria: Record<string, number> = {};
      const extrasItens: Record<string, number> = {};

      guests.forEach((g) => {
         base[g.base] += 1;
         proteina[g.proteina] += 1;
         acompanhamento[g.acompanhamento] += 1;
      });

      items.forEach((it) => {
         extrasCategoria[it.category] = (extrasCategoria[it.category] || 0) + it.quantity;
         extrasItens[it.name] = (extrasItens[it.name] || 0) + it.quantity;
      });
      return { base, proteina, acompanhamento, extrasCategoria, extrasItens };
   }, [guests, items]);

   // Cálculo de total (simples: base + acompanhamento + adicional)
   // Exemplo: cada base + proteina fixo 10, acompanhamento 4 (ajuste conforme real)
   const baseProteinaValor = 10;
   const acompanhamentoValor = 4;
   const pratosPrincipaisTotal = guests.length * (baseProteinaValor + acompanhamentoValor);
   const extrasTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
   const total = pratosPrincipaisTotal + extrasTotal;

   const [creating, setCreating] = useState(false);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const canCreate = tableNumber !== "" && guests.length > 0 && !creating;

   // Mapeia combinação base+proteína para item de menu mock
   // Map base+proteina to a real menu item by name heuristic
   const mapGuestToMenuItem = (g: GuestSelection): AdaptedMenuItem | undefined => {
      const patterns = [`${g.base} ${g.proteina}`, `${g.base} c/ ${g.proteina}`, `${g.base} com ${g.proteina}`].map(
         (p) => p.toLowerCase()
      );
      return menuItems.find((m) => patterns.some((p) => m.name.toLowerCase().includes(p)));
   };

   const buildGuestItems = () => {
      return guests.map((g) => {
         const menuRef = mapGuestToMenuItem(g);
         return {
            guestId: g.id,
            menuItemId: menuRef?.id || null,
            name: menuRef?.name || `${g.base} + ${g.proteina}`,
            quantity: 1,
            price: menuRef?.price ?? baseProteinaValor + acompanhamentoValor,
            category: "PRATOS" as Category,
            notes: [g.acompanhamento, g.observacao].filter(Boolean).join(" | ") || undefined,
         };
      });
   };

   const handleCreate = async () => {
      if (!canCreate) return;
      setErrorMsg(null);
      setCreating(true);
      try {
         const guestItems = buildGuestItems();
         // Extras convertidos
         const extraItems = items.map((it) => ({
            menuItemId: it.id,
            name: it.name,
            quantity: it.quantity,
            price: it.price,
            category: it.category,
         }));

         const enrichedPayload: NewOrderPayload & { guestItems: any[]; extraItems: any[] } = {
            customerName: customerName.trim() || `Mesa ${tableNumber}`,
            tableNumber: Number(tableNumber),
            status,
            notes: notes.trim() || undefined,
            numberOfPeople: guests.length,
            guests,
            items, // manter raw extras para compatibilidade
            totalAmount: total,
            summary,
            guestItems,
            extraItems,
         };

         // Dispara callback para camada superior (que decidirá chamar API)
         onCreate(enrichedPayload);

         // Reset somente após sucesso
         setCustomerName("");
         setTableNumber("");
         setStatus("PENDENTE");
         setNotes("");
         setPeople(1);
         setGuests([{ id: 1, base: "ARROZ", proteina: "CARNE", acompanhamento: "LEGUMES" }]);
         // extras desativados - estados removidos
         setItems([]);
      } catch (e: any) {
         setErrorMsg(e?.message || "Erro ao criar pedido");
      } finally {
         setCreating(false);
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
         <DialogTitle>Novo Pedido (Rápido)</DialogTitle>
         <DialogContent sx={{ pt: 1 }}>
            <Box mt={1} display="flex" flexDirection="column" gap={3}>
               {/* Cabeçalho */}
               <Box display="flex" gap={2} flexWrap="wrap">
                  {/* <TextField
                label="Nome / Referência"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                sx={{ flex: 1 }}
              /> */}

                  <TextField
                     label="Mesa"
                     type="number"
                     value={tableNumber}
                     onChange={(e) => setTableNumber(e.target.value === "" ? "" : Number(e.target.value))}
                     sx={{ width: 120 }}
                     inputProps={{ min: 1 }}
                  />

                  <FormControl sx={{ width: 180 }}>
                     <InputLabel>Status</InputLabel>
                     <Select value={status} label="Status" onChange={(e) => setStatus(e.target.value)}>
                        <MenuItem value="PENDENTE">Pendente</MenuItem>
                        <MenuItem value="EM_PREPARACAO">Em Preparação</MenuItem>
                        <MenuItem value="PRONTO">Pronto</MenuItem>
                        <MenuItem value="SERVIDO">Servido</MenuItem>
                     </Select>
                  </FormControl>

                  <TextField
                     label="Nº Pessoas"
                     type="number"
                     value={people}
                     onChange={(e) => {
                        const v = Number(e.target.value);
                        if (v >= 1) setPeople(v);
                     }}
                     sx={{ width: 140 }}
                  />

                  <Tooltip title="Copiar seleção do 1º para todos">
                     <span>
                        <IconButton onClick={duplicateFirst} disabled={guests.length < 2}>
                           <ContentCopy />
                        </IconButton>
                     </span>
                  </Tooltip>
               </Box>

               <TextField
                  label="Observações gerais"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  multiline
                  minRows={2}
                  fullWidth
               />

               <Divider />

               {/* Seleção por pessoa */}
               <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                     Pessoas (configuração individual)
                  </Typography>
                  <Box display="grid" gap={1} sx={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
                     {guests.map((g) => (
                        <GuestMealCard key={g.id} guest={g} onChange={(patch) => updateGuest(g.id, patch)} />
                     ))}
                  </Box>
               </Box>

               {/* Resumo agregado rápido */}
               <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                     Resumo por Pessoa
                  </Typography>
                  <Box display="grid" gap={1} sx={{ gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))" }}>
                     {guests.map((g) => (
                        <GuestMealSummaryCard key={`resume-${g.id}`} guest={g} />
                     ))}
                  </Box>
               </Box>

               <Divider />

               <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">Total estimado: R$ {total.toFixed(2)}</Typography>
                  <Typography variant="caption" color="text.secondary">
                     (Valor base por pessoa ajustar depois conforme cardápio real)
                  </Typography>
               </Box>
            </Box>
         </DialogContent>
         <DialogActions>
            <Button onClick={onClose}>Cancelar</Button>
            {menuError && (
               <Box mr={2} display="flex" alignItems="center">
                  <Typography variant="caption" color="error">
                     {menuError}
                  </Typography>
               </Box>
            )}
            {errorMsg && (
               <Box mr={2} display="flex" alignItems="center">
                  <Typography variant="caption" color="error">
                     {errorMsg}
                  </Typography>
               </Box>
            )}
            <Button variant="contained" onClick={handleCreate} disabled={!canCreate}>
               {creating ? "Criando..." : "Criar Pedido"}
            </Button>
         </DialogActions>
      </Dialog>
   );
};

export default NewOrderDialog;
