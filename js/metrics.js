const jerzy=require('jerzy')
const pushFixedLength=(data, newElement, maxSize)=>{
    data.push(newElement)
    if(data.length>maxSize){
        data.shift()
    }
    return data
}

//yArray can be a "reprenstation" of the data if the original data is too big
const computeDrift=(xArray, yArray)=>{
    const x=jerzy.Vector(xArray)
    const y=jerzy.Vector(yArray)
    const ks=new jerzy.Nonparametric.kolmogorovSmirnov(x, y)
    return ks.ks
}


const specificity=({tn, fp})=>tn/(tn+fp)
const sensitivity=({tp, fn})=>tp/(tp+fn)
const precision=({tp, fp})=>tp/(tp+fp)
const accuracy=({tp, tn, fp, fn})=>(tp+tn)/(tp+tn+fp+fn)

const generateConfusionMatrix=newElements=>newElements
    .reduce(({tp, tn, fp, fn}, {predicted, actual})=>{
        if(predicted===actual && predicted===1){
            return {tn, fp, fn, tp:tp+1}
        }
        if(predicted===actual&&predicted===0){
            return {tp, fp, fn, tn:tn+1}
        }
        if(predicted!==actual&&predicted===1){
            return {tp, tn, fn, fp:fp+1}
        }
        if(predicted!==actual&&actual===1){
            return {tp, tn, fp, fn:fn+1}
        }
    }, {tp:0, tn:0, fp:0, fn:0})


const updateInputMetrics=(keys, initInputMetric, inputArray, maxSize)=>{
    inputArray.forEach(input=>{
        keys.forEach(key=>{
            initInputMetric[key]=pushFixedLength(initInputMetric[key], input[key], maxSize)
        })
    })
    return initInputMetric
}

const getKeys=inputArray=>{
    if(!Array.isArray(inputArray)||inputArray.length===0){
        throw new Error('Needs array with at least one element')
    }
    const [init]=inputArray
    return Object.keys(init)
}

const createInitialInputMetrics=(inputArray, maxSize)=>{
    if(!Array.isArray(inputArray)||inputArray.length===0){
        throw new Error('Needs array with at least one element')
    }
    const keys=getKeys(inputArray)
    const [init, ...rest]=inputArray
    const initInputMetric=keys.reduce((aggr, key)=>({
        ...aggr,
        [key]:[init[key]]
    }), {})
    return updateInputMetrics(keys, initInputMetric, rest, maxSize)
}


module.exports={
    createInitialInputMetrics,
    updateInputMetrics,
    generateConfusionMatrix, //for testing
    pushFixedLength, //for testing
    specificity,
    sensitivity,
    precision,
    accuracy,
}