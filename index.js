const fs = require('fs');

/*
 * Read the input file, line by line
 * @param {ReadableStream} a Readable Stream created from the input path
 * @param {String} outPath -> the path of the output file
 * @param {Function} fn -> callback function to run after every line of data
 */
const readLines = (input, outPath, fn) => {
    let remaining = '';

    input.on('data', (data) => {
        remaining += data;
        let index = remaining.indexOf('\n');
        let last = 0;
        while (index > -1) {
            let line = remaining.substring(last, index);
            last = index + 1;
            fn(line).then(newContent => {
                write(outPath, newContent)
            });
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);
    });

    input.on('end', () => {
        if (remaining.length > 0) {
            fn(remaining).then(newContent => {
                write(outPath, newContent)
            });
        }
    });
}

/*
 * An object to store lowerCase & upperCase related utilities
 */
const caseOps = {
    lowerCase: {
        is: str => str === str.toLowerCase(),
        fn: str => str.toLowerCase()
    },
    upperCase: {
        is: str => str === str.toUpperCase(),
        fn: str => str.toUpperCase()
    }
}

/*
 * Write (append) to an output file, line by line
 * @param {String} str -> the content to write
 * @param {String} outPath -> the path of the output file
 */
const write = (outPath, str) => {
    fs.appendFile(outPath, str + '\n', err => {
        if (err) {
            return console.log(err);
        }
    });
}

/*
 * Clone the casing of the string-to-be-replaced on the replacing string
 * @param {Array} caseArr -> array holding the casing of the string-to-be-replaced
 * @param {String} replacement -> the replacing string
 * @return {String} -> the replacement string, with the same casing as the particular instance of the string its replacing
 */
const cloneCase = (caseArr, replacement) => {
    let splitTgt = replacement.split('');
    let caseClonedTgt = '';
    let i = 0;

    caseArr.forEach(value => {
        if (i < splitTgt.length) {
            caseClonedTgt += caseOps[value]['fn'](splitTgt[i++]);
        }
    })

    return caseClonedTgt + replacement.substring(i, replacement.length);
}

/*
 * Store the casing of each character of the string-to-be-replaced in an array
 * @param {String} str -> string-to-be-replaced
 * @return {Array}
 */
const buildCaseArr = (str) => {
    return str.split('').map(char => {
        const isLowerCase = caseOps['lowerCase']['is'](char);
        return isLowerCase ? 'lowerCase' : 'upperCase'
    })
}

/*
 * Remove punctuation from string
 * @param {String} str
 * @return {String}
 */
const removePunc = (str) => {
    return (
        str
        .replace(/[.,\/#"'?!$%\^&\*;:{}=\-_`~()]/g, "")
        .replace(/\s{2,}/g, " ")
    )
}

/*
 * Replace the target with the desired string, while preserving casing & punctuation
 * @param {String} cand -> the particular string replacement candidate
 * @param {String} replacement
 * @param {String} replaceable
 * @return {String}
 */
const localReplace = (cand, replacement, replaceable) => {

    const punclessCand = removePunc(cand);

    if (cand.includes(punclessCand) && punclessCand.toLowerCase() === replaceable.toLowerCase()) {
        const caseArr = buildCaseArr(punclessCand);
        const casedReplacement = cloneCase(caseArr, replacement);
        return cand.replace(punclessCand, casedReplacement);
    }

    return cand;
}

/*
 * Replace the target with the desired string, while preserving casing & punctuation
 * @param {String} cand -> the particular string replacement candidate
 * @param {String} replacement
 * @param {String} replaceable
 * @return {Promise}
 */
const replace = (replacement, replaceable, cand) => new Promise(resolve => {
    const lineArr = cand.split(' ');
    const newArr = lineArr.map(el => {
        return localReplace(el, replacement, replaceable);
    });

    resolve(newArr.join(' '));
})

/*
 * Replace all instances of a string with another, while preserving casing & punctuation
 * @param {String} inPath -> the path of the input file
 * @param {String} outPath -> the path of the output file
 * @param {String} replacement -> the replacing string
 * @param {String} replaceable -> the string-to-be-replaced
 */
const swichr = (inPath, outPath, replacement, replaceable) => {
    readLines(
        fs.createReadStream(inPath), 
        outPath, 
        replace.bind(null, replacement, replaceable)
    );
}

module.exports = swichr;
