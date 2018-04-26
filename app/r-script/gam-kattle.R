needs(gam)
needs(boot)
needs(ISLR)

attach(input[[1]])
attach(Kattle)

gam1=gam(output~s(materials,df=3)+s(services,df=13),data=Kattle)

if (args == "error") {
  cv.error=cv.glm(Kattle,gam1,K=5)$delta[1]
  return(cv.error)
} else if (args == "predict") {
  preds=predict(gam1,newdata=data.frame(dataTest))
  return(preds)
}