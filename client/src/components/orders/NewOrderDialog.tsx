import React, { useMemo, useState } from "react";
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

type Category = "PRATOS" | "BEBIDAS" | "SOBREMESAS" | "OUTROS";
type BaseTipo = "ARROZ" | "SOPA";
type ProteinaTipo = "CARNE" | "PEIXE";
type AcompanhamentoTipo = "LEGUMES" | "SALADA";

interface MenuMockItem {
   id: string;
   name: string;
   price: number;
   category: Category;
}

const mockMenu: MenuMockItem[] = [
   { id: "m1", name: "Arroz c/ Carne", price: 12, category: "PRATOS" },
   { id: "m2", name: "Arroz c/ Peixe", price: 14, category: "PRATOS" },
   { id: "m3", name: "Sopa c/ Carne", price: 11, category: "PRATOS" },
   { id: "m4", name: "Sopa c/ Peixe", price: 13, category: "PRATOS" },
   { id: "m5", name: "Refrigerante", price: 6, category: "BEBIDAS" },
   { id: "m6", name: "Sumo Natural", price: 9, category: "BEBIDAS" },
   { id: "m7", name: "Legumes Salteados", price: 5, category: "OUTROS" },
   { id: "m8", name: "Salada Fresca", price: 5, category: "OUTROS" },
];

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

   // Itens adicionais (bebidas, sobremesas, etc)
   // Extras temporariamente desativados
   const [items, setItems] = useState<OrderItemDraft[]>([]);

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
   const mapGuestToMenuItem = (g: GuestSelection): MenuMockItem | undefined => {
      if (g.base === "ARROZ" && g.proteina === "CARNE") return mockMenu.find((m) => m.id === "m1");
      if (g.base === "ARROZ" && g.proteina === "PEIXE") return mockMenu.find((m) => m.id === "m2");
      if (g.base === "SOPA" && g.proteina === "CARNE") return mockMenu.find((m) => m.id === "m3");
      if (g.base === "SOPA" && g.proteina === "PEIXE") return mockMenu.find((m) => m.id === "m4");
      return undefined;
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

               {/* Itens extras */}
               {/* <Typography variant="subtitle1" fontWeight="bold">
                  Extras (Bebidas, Sobremesas etc)
               </Typography> */}

               {/* <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
                  <FormControl sx={{ minWidth: 140 }}>
                     <InputLabel>Categoria</InputLabel>
                     <Select
                        value={category}
                        label="Categoria"
                        onChange={(e) => {
                           setCategory(e.target.value as Category);
                           setSelectedMenuId("");
                        }}
                     >
                        <MenuItem value="BEBIDAS">Bebidas</MenuItem>
                        <MenuItem value="PRATOS">Pratos</MenuItem>
                        <MenuItem value="SOBREMESAS">Sobremesas</MenuItem>
                        <MenuItem value="OUTROS">Outros</MenuItem>
                     </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 260 }}>
                     <InputLabel>Item</InputLabel>
                     <Select value={selectedMenuId} label="Item" onChange={(e) => setSelectedMenuId(e.target.value)}>
                        {filteredMenu.map((m) => (
                           <MenuItem key={m.id} value={m.id}>
                              {m.name} - R$ {m.price.toFixed(2)}
                           </MenuItem>
                        ))}
                     </Select>
                  </FormControl>

                  <Tooltip title="Adicionar item">
                     <span>
                        <IconButton
                           color="primary"
                           onClick={addItem}
                           disabled={!selectedMenuId}
                           sx={{ border: "1px solid", borderColor: "divider" }}
                        >
                           <Add />
                        </IconButton>
                     </span>
                  </Tooltip>
               </Box> */}

               {/* <Box display="flex" flexDirection="column" gap={1}>
                  {items.length === 0 && (
                     <Typography variant="body2" color="text.secondary">
                        Nenhum extra adicionado.
                     </Typography>
                  )}
                  {items.map((it) => (
                     <Box
                        key={it.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{
                           p: 1,
                           border: "1px solid",
                           borderColor: "divider",
                           borderRadius: 1,
                        }}
                     >
                        <Typography variant="body2" sx={{ flex: 1 }}>
                           {it.name}
                        </Typography>
                        <TextField
                           size="small"
                           type="number"
                           label="Qtd"
                           value={it.quantity}
                           onChange={(e) => updateQty(it.id, Number(e.target.value))}
                           sx={{ width: 90 }}
                           inputProps={{ min: 0 }}
                        />
                        <Typography variant="body2">R$ {(it.price * it.quantity).toFixed(2)}</Typography>
                        <IconButton onClick={() => removeItem(it.id)} size="small" color="error">
                           <Delete fontSize="small" />
                        </IconButton>
                     </Box>
                  ))}
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
