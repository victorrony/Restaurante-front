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
import { menuAPI } from "../../services/api";

type Category = "PRATOS" | "BEBIDAS" | "SOBREMESAS" | "OUTROS";
export type BaseTipo = string;
export type ProteinaTipo = string;
export type AcompanhamentoTipo = string;

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

export interface GuestSelection {
   id: number;
   base: BaseTipo;
   proteina: ProteinaTipo;
   acompanhamento: AcompanhamentoTipo;
   observacao?: string;
   bebidas?: string;
   sobremesas?: string;
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
      extrasCategoria: Record<string, number>;
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
            // Loading complete
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

   // Total calculation with fixed prices
   const baseProteinaValor = 10;
   const acompanhamentoValor = 4;
   const pratosPrincipaisTotal = guests.length * (baseProteinaValor + acompanhamentoValor);
   const extrasTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
   const total = pratosPrincipaisTotal + extrasTotal;

   const [creating, setCreating] = useState(false);
   const [errorMsg, setErrorMsg] = useState<string | null>(null);

   const canCreate = tableNumber !== "" && guests.length > 0 && !creating;

   // Map base+proteina to a real menu item by name heuristic
   const findMenuItemById = (id: string): AdaptedMenuItem | undefined => {
      return menuItems.find((m) => m.id === id);
   };

   const buildGuestItems = () => {
      const allGuestItems: any[] = [];

      guests.forEach((guest) => {
         // Add each selected menu item as a separate order item
         if (guest.base) {
            const baseItem = findMenuItemById(guest.base);
            if (baseItem) {
               allGuestItems.push({
                  menuItemId: baseItem.id,
                  quantity: 1,
                  price: baseItem.price,
                  notes: `Pessoa #${guest.id}${guest.observacao ? ` - ${guest.observacao}` : ""}`,
               });
            }
         }

         if (guest.proteina) {
            const proteinaItem = findMenuItemById(guest.proteina);
            if (proteinaItem) {
               allGuestItems.push({
                  menuItemId: proteinaItem.id,
                  quantity: 1,
                  price: proteinaItem.price,
                  notes: `Pessoa #${guest.id}${guest.observacao ? ` - ${guest.observacao}` : ""}`,
               });
            }
         }

         if (guest.acompanhamento) {
            const acompItem = findMenuItemById(guest.acompanhamento);
            if (acompItem) {
               allGuestItems.push({
                  menuItemId: acompItem.id,
                  quantity: 1,
                  price: acompItem.price,
                  notes: `Pessoa #${guest.id}${guest.observacao ? ` - ${guest.observacao}` : ""}`,
               });
            }
         }

         if (guest.bebidas) {
            const bebidaItem = findMenuItemById(guest.bebidas);
            if (bebidaItem) {
               allGuestItems.push({
                  menuItemId: bebidaItem.id,
                  quantity: 1,
                  price: bebidaItem.price,
                  notes: `Pessoa #${guest.id}${guest.observacao ? ` - ${guest.observacao}` : ""}`,
               });
            }
         }

         if (guest.sobremesas) {
            const sobremesaItem = findMenuItemById(guest.sobremesas);
            if (sobremesaItem) {
               allGuestItems.push({
                  menuItemId: sobremesaItem.id,
                  quantity: 1,
                  price: sobremesaItem.price,
                  notes: `Pessoa #${guest.id}${guest.observacao ? ` - ${guest.observacao}` : ""}`,
               });
            }
         }
      });

      return allGuestItems;
   };

   const handleCreate = async () => {
      console.log('🚀 handleCreate called');
      if (!canCreate) {
         console.log('❌ Cannot create - validation failed');
         return;
      }
      setErrorMsg(null);
      setCreating(true);
      console.log('📝 Starting order creation...');
      try {
         // Validate required fields
         if (!tableNumber ) {
            throw new Error("Número da mesa é obrigatório");
         }

         // Check if at least one guest has at least one item selected
         const hasValidSelections = guests.some(
            (guest) => guest.base || guest.proteina || guest.acompanhamento || guest.bebidas || guest.sobremesas
         );

         if (!hasValidSelections) {
            throw new Error("Pelo menos uma pessoa deve ter pelo menos um item selecionado");
         }

         console.log('👥 Guests data:', guests);
         const guestItems = buildGuestItems();
         console.log('🍽️ Guest items built:', guestItems);
         
         const extraItems = items.map((it) => ({
            menuItemId: it.id,
            quantity: it.quantity,
            price: it.price,
            notes: undefined,
         }));
         console.log('➕ Extra items:', extraItems);

         // Combine all items for the order
         const allOrderItems = [...guestItems, ...extraItems];
         console.log('📦 All Order Items:', allOrderItems);

         // Calculate total from actual items
         const actualTotal = allOrderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
         console.log('💰 Calculated total:', actualTotal);

         const orderPayload: NewOrderPayload = {
            customerName: customerName.trim() || `Mesa ${tableNumber}`,
            tableNumber: Number(tableNumber),
            status,
            notes: notes.trim() || undefined,
            numberOfPeople: guests.length,
            guests,
            items: allOrderItems,
            totalAmount: actualTotal,
            summary,
         };
         console.log('📋 Final order payload:', orderPayload);

         console.log('🔄 Calling onCreate...');
         onCreate(orderPayload);
         console.log('✅ onCreate called successfully');

         // Reset form after success
         setCustomerName("");
         setTableNumber("");
         setStatus("PENDENTE");
         setNotes("");
         setPeople(1);
         setGuests([
            { id: 1, base: "", proteina: "", acompanhamento: "", observacao: "", bebidas: "", sobremesas: "" },
         ]);
         setItems([]);         
      } catch (e: any) {
         console.error('❌ Error in handleCreate:', e);
         setErrorMsg(e?.message || "Erro ao criar pedido");
      } finally {
         console.log('🏁 handleCreate finished');
         setCreating(false);
      }
   };

   return (
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
         <DialogTitle>Novo Pedido (Rápido)</DialogTitle>
         <DialogContent sx={{ pt: 1 }}>
            <Box mt={1} display="flex" flexDirection="column" gap={3}>
               {/* Header */}
               <Box display="flex" gap={2} flexWrap="wrap">
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
               {/* <Box>
                  <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                     Resumo por Total
                  </Typography>
                  <Box display="grid" gap={1} sx={{ gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))" }}>
                     <OrderSummaryCard title="Bases" summary={summary.base} />
                     <OrderSummaryCard title="Proteínas" summary={summary.proteina} />
                     <OrderSummaryCard title="Acompanhamentos" summary={summary.acompanhamento} />
                     {Object.keys(summary.extrasCategoria).length > 0 && (
                        <OrderSummaryCard title="Extras (Categorias)" summary={summary.extrasCategoria} />
                     )}
                     {Object.keys(summary.extrasItens).length > 0 && (
                        <OrderSummaryCard title="Extras (Itens)" summary={summary.extrasItens} />
                     )}
                  </Box>
               </Box> */}

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
