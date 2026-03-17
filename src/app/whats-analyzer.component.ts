import { Component, signal, computed } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { SliderModule } from 'primeng/slider'
import { finalize, timeout } from 'rxjs'
import { environment } from '../environments/environment'

@Component({
selector:'app-whats-analyzer',
standalone:true,
imports:[CommonModule,FormsModule,SliderModule],

templateUrl:'./whats-analyzer.component.html',
styleUrls:['./whats-analyzer.component.css']
})
export class WhatsAnalyzerComponent{

constructor(private http:HttpClient){}

systemPrompt = `
{
 "resumo":"string",
 "indicadores":{
  "envolvidos":0,
  "tarefas":0,
  "prazos":0,
  "riscos":0,
  "conflitos":0,
  "sentimento":0
 },
 "sentimentoDescricao":"string",
 "participantes":["string"],
 "tarefas":[
  {"descricao":"string","envolvido":"string","prioridade":"string"}
 ],
 "prazos":[
  {"descricao":"string","data":"string","envolvido":"string"}
 ],
 "riscos":[
  {"descricao":"string","envolvido":"string"}
 ],
 "conflitos":[
  {"descricao":"string","envolvido":"string"}
 ]
}
`

model="GLM-4.5-Flash"

temperatureValue=0.2

token=environment.zAiToken || ''

fileContent=signal<string|null>(null)

loading=signal(false)

result=signal<any|null>(null)

errorMessage=signal<string | null>(null)

filtro=signal('')

upload(event:any){

const file=event.target.files[0]

if(!file) return

if(!file.name.endsWith('.txt')){
alert('Apenas arquivos .txt')
return
}

const reader=new FileReader()

reader.onload=()=>{
this.fileContent.set(reader.result as string)
}

reader.readAsText(file)

}

analyze(){

this.errorMessage.set(null)

if(!this.token){
this.errorMessage.set('Informe o token da API para continuar.')
return
}

this.loading.set(true)

this.http.post(
'https://api.z.ai/api/paas/v4/chat/completions',
{
model:this.model,
temperature:this.temperatureValue,
stream:false,
response_format:{type:'json_object'},
messages:[
{role:'system',content:this.systemPrompt},
{role:'user',content:this.fileContent()}
]
},
{
headers:{Authorization:`Bearer ${this.token}`}
}
)
.pipe(
timeout(150000),
finalize(()=>this.loading.set(false))
)
.subscribe({

next:(res:any)=>{
try{
const content=res?.choices?.[0]?.message?.content
this.result.set(JSON.parse(content))
}catch{
this.errorMessage.set('A IA retornou uma resposta inesperada.')
}
},

error:(err)=>{

if(err.name==='TimeoutError'){
this.errorMessage.set('A análise demorou muito para responder. Tente novamente.')
return
}

if(err?.error?.code===1302){
this.errorMessage.set('O limite da API foi atingido. Aguarde alguns minutos.')
return
}

this.errorMessage.set('Não foi possível analisar a conversa no momento.')
}

})

}

participantes=computed(()=>this.result()?.participantes||[])

indicadores=computed(()=>this.result()?.indicadores || {
envolvidos:this.participantes().length,
tarefas:(this.result()?.tarefas||[]).length,
prazos:(this.result()?.prazos||[]).length,
riscos:(this.result()?.riscos||[]).length,
conflitos:(this.result()?.conflitos||[]).length,
sentimento:5
})

filterList(list:any[]){

const p=this.filtro()

if(!p) return list

return list.filter(i=>
(i.envolvido||'').toLowerCase().includes(p.toLowerCase())
)

}

tarefasFiltradas=computed(()=>this.filterList(this.result()?.tarefas||[]))
prazosFiltrados=computed(()=>this.filterList(this.result()?.prazos||[]))
riscosFiltrados=computed(()=>this.filterList(this.result()?.riscos||[]))
conflitosFiltrados=computed(()=>this.filterList(this.result()?.conflitos||[]))

getSentimentoNormalizado(){

let score = this.indicadores().sentimento

/* converte escala 0-1 para 0-10 */

if(score <= 1){
score = score * 10
}

/* arredonda */

return Math.round(score)

}

emojiSentimento(){

const score = this.getSentimentoNormalizado()
const descricao = (this.result()?.sentimentoDescricao || '').toLowerCase()

const positivo = [
'positivo',
'feliz',
'motivado',
'otimista',
'confiante',
'gratidão',
'encorajador',
'animado',
'produtivo',
'colaborativo',
'suporte',
'proatividade'
]

const negativo = [
'conflito',
'problema',
'triste',
'exausto',
'pressão',
'erro',
'risco',
'crise',
'frustração'
]

if(score<=2) return '😢'
if(score<=4) return '😕'
if(score<=6) return '😐'
if(score<=8) return '🙂'
if(score<=10) return '😊'

if(positivo.some(p => descricao.includes(p))) return '😊'
if(negativo.some(p => descricao.includes(p))) return '😕'

return '😐'

}

setTemperatureFromBar(event: MouseEvent){

const bar = event.currentTarget as HTMLElement

const rect = bar.getBoundingClientRect()

const x = event.clientX - rect.left

const width = rect.width

let percent = x / width

if(percent < 0) percent = 0
if(percent > 1) percent = 1

this.temperatureValue = parseFloat(percent.toFixed(2))

  }
}