import { HttpInterceptorFn } from '@angular/common/http'

export const noAuthZaiInterceptor: HttpInterceptorFn = (req,next)=>{

if(req.url.includes('api.z.ai')){
return next(req)
}

const token=localStorage.getItem('jwt')

if(token){
req=req.clone({
setHeaders:{Authorization:`Bearer ${token}`}
})
}

return next(req)

}