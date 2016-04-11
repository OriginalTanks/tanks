package pregameprocessor;

import database.DBTank;
import database.GameDatabase;
import database.GameDatabaseImpl;
import game.Game;
import game.board.elements.CoreTank;
import game.board.elements.Tank;
import game.board.elements.TankImpl;
import game.util.JavaSourceFromString;

import org.bson.types.ObjectId;

import javax.tools.*;

import java.io.File;
import java.lang.reflect.Constructor;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.Arrays;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by nathand on 12/1/15.
 */
public class TankCodeLoader {

	// public members
	//public static File tankCodeDirectory = new File("./tankCode/");
    public static GameDatabase db = GameDatabaseImpl.getSingleton();
    public static String compiledTankCodeDirectory = "./compiledTanks/";
    
    // private members
    private static String tankClassLoc = "game.board.elements.Tank";
    private static final String CLASS_STR = "public class ";
    private static final String IMPORT_STR = "import";
    private static final String PACKAGE_STR = "package ";
    private static final String THREAD_STR = "new Thread(";
    private static final String RUNNABLE_STR = "new Runnable(";
    private static final String EXT_THREAD_STR = "extends Thread";
    private static final String THREAD_CALL_STR = "Thread.";
    private static final String RUNTIME_STR = "Runtime";
    private static final String SYSTEM_STR = "System.";
    private static final String SEC_MAN_STR = "SecurityManager";
    private static final String PROCESS_STR = "Process";
    private static final String SEMICOLON = ";";
    private static final String SL_COMMENT_OPEN = "//";
    private static final char SL_COMMENT_CLOSE = '\n';
    private static final String ML_COMMENT_OPEN = "/*";
    private static final String ML_COMMENT_CLOSE = "*/";
    private static final String COMMENT_THREADS = "/*Thou shalt cling unto thine own thread!*/";
    private static final String COMMENT_RUNTIME = "/*Thou shalt not execute system commands!*/";
    private static final String COMMENT_SYSTEM = "/*Thou shalt not use java.lang.System!*/";
    private static final String COMMENT_SECURITY = "/*Thou shalt not set app security!*/";
    private static final String COMMENT_PROCESS = "/*Thou shalt not use java.lang.Process(Builder)!*/";
    private static final String CORE_TANK = "CoreTank";
    private static final String ERR_BAD_IMPORTS = "[ERROR] You have used unapproved import statements. Please remove them.";
    private static final String ERR_THREADS_RUNNABLE = "[ERROR] You have used Thread and/or Runnable code, which is forbidden. Please remove these calls.";
    private static final String ERR_OTHERS = "[ERROR] You have made calls to Runtime, System, or SecurityManager packages. This is not permitted.";

    // approved Java package name patterns
    private static final String[] APPROVED_PACKAGES = {
    	"\\s*game.*",
    	"\\s*org\\.bson.*",
    	"\\s*org\\.mongodb.*",
    	"\\s*java\\.util.*"
    };

    private static final String[] TANK_CLASSES = {
        "BasicTank",
        "HeavyTank",
        "LightTank"
    };

    public static Tank loadTank(ObjectId tankId, String name, Game game) {
        try {
            String nameCore = name + "Core";
        	
        	// 0) get info and tank code text
            DBTank tank = db.loadDBTank(tankId);

            String code = tank.getCode();
            String codeCore = toCore(code);
            
            // 1) Rename the tank to guarantee unique tank class names
        	// 		within the game
            code = replaceTankClassName(code, name);
            codeCore = replaceTankClassName(codeCore, nameCore);
            
            // 2) Remove all code before imports
            //	WARNING: must be called before removing unapproved imports
            //	or else code will become jumbled!!!!!
            code = removePackageDeclaration(code);
            codeCore = removePackageDeclaration(codeCore);
            
            // 3) Remove all imports that aren't whitelisted
            if (containsUnapprovedImports(code)) {
                String cErr = "Compilation error!\nTank: " + name + "\n" + ERR_BAD_IMPORTS;
                System.err.println(cErr);
                Tank t = new TankImpl();
                t.setError_message(cErr);
                return t;
            }
            
            // 4) Remove calls that can create threads
            if (containsThreadAndRunnableCalls(code)) {
                String cErr = "Compilation error!\nTank: " + name + "\n" + ERR_THREADS_RUNNABLE;
                System.err.println(cErr);
                Tank t = new TankImpl();
                t.setError_message(cErr);
                return t;
            }

            // 5) Remove java.lang included functionality
            //    This includes Runtime (allows system calls), System (allows file streams),
            //    and SecurityManager (could potentially brick our running program)
            if (containsOtherJavaLangProblems(code)) {
                String cErr = "Compilation error!\nTank: " + name + "\n" + ERR_OTHERS;
                System.err.println(cErr);
                Tank t = new TankImpl();
                t.setError_message(cErr);
                return t;
            }

            // 6) Take the code out
            //		Save it to a file
            JavaFileObject file = new JavaSourceFromString(name, code);
            JavaFileObject fileCore = new JavaSourceFromString(nameCore, codeCore);

            // 7) Set up variables (classpath) necessary
            JavaCompiler comp = ToolProvider.getSystemJavaCompiler();

            //DiagnosticCollector<JavaFileObject> diagnostics = new DiagnosticCollector<JavaFileObject>();
            //StandardJavaFileManager fileManager = comp.getStandardFileManager(diagnostics, null, null);

            Iterable<? extends JavaFileObject> compilationUnits = Arrays.asList(file);
            Iterable<? extends JavaFileObject> compilationUnitsCore = Arrays.asList(fileCore);

            StandardJavaFileManager fileManager = comp.getStandardFileManager( null, null, null);
            fileManager.setLocation(StandardLocation.CLASS_OUTPUT,Arrays.asList(new File("src")));

            JavaCompiler.CompilationTask task = comp.getTask(null, fileManager,null,null, null, compilationUnits);
            JavaCompiler.CompilationTask taskCore = comp.getTask(null, fileManager, null, null, null, compilationUnitsCore);

            //for (Diagnostic diagnostic : diagnostics.getDiagnostics())
            //    System.out.format("Error on line %d in %s%n",
            //            diagnostic.getLineNumber(),
            //            diagnostic.getSource().toString());

            //fileManager.close();
            //System.err.println(name);
            boolean success = taskCore.call() && task.call();

            if (success) {
                try {
                    File f = new File("src");
                    File fCore = new File("src");

                    //System.err.println(f.toURI().toURL());
                    URLClassLoader classLoader = URLClassLoader.newInstance(new URL[]{f.toURI().toURL()});
                    URLClassLoader classLoaderCore = URLClassLoader.newInstance(new URL[]{fCore.toURI().toURL()});

                    Class<?> cs = Class.forName(name, true, classLoader);
                    Class<?> csCore = Class.forName(nameCore, true, classLoaderCore);

                    Constructor<?> ctor = cs.getConstructor(ObjectId.class, String.class);
                    Constructor<?> ctorCore = csCore.getConstructor(ObjectId.class, String.class);

                    //compile as CoreTank, throw error if fail
                    CoreTank c = (CoreTank)ctorCore.newInstance(tankId, "Core Tank");
                    //compile as Tank, actual object to return
                    Tank t = (Tank) ctor.newInstance(tankId, "My Tank");
                    return t;
                } catch (Exception e) {
                    String eCls = e.getClass().toString().substring(6);
                    String eMsg = e.getMessage();
                    String eStk = e.getStackTrace()[0].toString();
                    String eErr = eCls + (eMsg == null ? "" : (": " + eMsg)) + "\n\tat " + eStk;
                    String cErr = "Compilation error! Reflection failed\nTank: " + name + "\n" + eErr;
                    System.err.println(cErr);
                    Tank t = new TankImpl();
                    t.setError_message(cErr);
                    return t;
                }
            } else {
                String cErr = "Compilation error!\nTank: " + name;
                System.err.println(cErr);
                Tank t = new TankImpl();
                t.setError_message(cErr);
                return t;
            }
        } catch (Exception e) {
            String eCls = e.getClass().toString().substring(6);
            String eMsg = e.getMessage();
            String eStk = e.getStackTrace()[0].toString();
            String eErr = eCls + (eMsg == null ? "" : (": " + eMsg)) + "\n\tat " + eStk;
            String cErr = "Compilation error!\nTank: " + name + "\n" + eErr;
            System.err.println(cErr);
            Tank t = new TankImpl();
            t.setError_message(cErr);
            return t;
        }
    }
    
    //
    // Private methods
    //
    
    private static String replaceTankClassName(String code, String tankName) {
    	
    	// find the class declaration
        int start = code.indexOf(CLASS_STR) + CLASS_STR.length();
        int end = code.indexOf(" ", start);
        String nName = code.substring(start, end);
        
        // replace provided classname with unique identifying one from us
        code = code.replaceAll(nName, tankName + " ");
        return code;
    }
    
    private static boolean containsThreadAndRunnableCalls(String code) {
    	
    	// Right now, there's no guaranteed security setup
    	// So, we want to prevent user code from creating Threads or Runnable
    	// objects. This might leave their code butchered, as it does not attempt 
    	// clean removal, but they surrendered that right when they injected
    	// this kind of crap, IMHO.
    	//
    	// WARNING: currently not comment-safe (will remove instances of 
    	// these strings from comments as well as live code)
    	String oldCode = code;
    	code = code.replace(THREAD_STR, COMMENT_THREADS);
    	code = code.replace(RUNNABLE_STR, COMMENT_THREADS);
    	code = code.replace(EXT_THREAD_STR, COMMENT_THREADS);
    	code = code.replace(THREAD_CALL_STR, COMMENT_THREADS);
    	return !code.equals(oldCode);
    }
    
    private static boolean containsOtherJavaLangProblems(String code) {
    	
    	// The Runtime object comes with java.lang and therefore reqires no import
    	// statements. It can give the programmer access to the command line by
    	// taking in Strings that can be evaluated as shell commands!
    	//
    	// This cannot be permitted. Go forth and slay them!
    	String oldCode = code;
    	code = code.replace(RUNNABLE_STR, COMMENT_RUNTIME);
    	code = code.replace(SEC_MAN_STR, COMMENT_SECURITY);
    	code = code.replace(SYSTEM_STR, COMMENT_SYSTEM);
    	code = code.replace(PROCESS_STR, COMMENT_PROCESS);
    	return !code.equals(oldCode);
    }
    
    private static String removePackageDeclaration(String code) {
    	
    	// Q: WHY ARE WE DOING THIS BY HAND? IT'S SO UGLY!
    	// I originally did the hand parsing because I was calling the code
    	// sanitations methods out of order and it was causing string 
    	// foolishness I couldn't track down.
    	//
    	// However, now that bug is solved, this is still cleaner, easier
    	// to read code than the "more abstract" use of indexOf() to track
    	// comments and import statements, and it works. So... don't fix
    	// what isn't broken.
    	
    	// Q: WHY NOT JUST REMOVE PACKAGE STATEMENTS? WHY THE MASSIVE FILE CHOP?
    	// For overkill safety, with a guarantee that a valid, compilable Java file
    	// will suffer no damage from it anyway
    	
    	// Looking for the first valid import statement and removing everything before it
    	// Why not just find the package statement? because that would require we find *all*
    	// package statements; otherwise, someone could have 2 package statements, we'd
    	// remove the first one, then their 2nd package statement would be left to happily
    	// compile even though their original code would not have.
    	
    	int i = -1;
    	boolean isLineComment = false;
    	boolean isBlockComment = false;
    	
    	while(++i < code.length()) {
    		
    		//System.out.println(String.format("...char: \"%c\" at i:%d", code.charAt(i), i));
    		switch (code.charAt(i)) {
    		
    		case '/':
    			if (i+1 < code.length()) {
	    			if (code.charAt(i+1) == '/' && !isBlockComment) {
	    				// we've found a line comment!
	    				isLineComment = true;
	    				i++;
	    			}
	    			else if (code.charAt(i+1) == '*' && !isLineComment) {
	    				// we've found a multi-line comment!
	    				isBlockComment = true;
	    				i++;
	    			}
    			}
    			break;
    			
    		case '*':
    			if (i+1 < code.length()) {
	    			if (code.charAt(i+1) == '/' && !isLineComment) {
	    				// we're ending a multiline!
	    				isBlockComment = false;
	    				i++;
	    			}
    			}
    			break;
    			
    		case '\n':
    			isLineComment = false;
    			break;
    			
    		case 'i':
    			if (i+IMPORT_STR.length() < code.length()) {
	    			if (code.substring(i, i+IMPORT_STR.length()).equals(IMPORT_STR)
	    					&& !isLineComment && !isBlockComment) {
	    				
	    				// found an un-commented import statement!
	    				// remove all text before it, as it's all possibly-valid
	    				// package statement(s) and comments!
	    				code = code.substring(i);
	    				return code;
	    			}
    			}
    			break;
    			
    		case 'p':
    			if (i+CLASS_STR.length() < code.length()) {
    				if (code.substring(i, i+CLASS_STR.length()).equals(CLASS_STR)
    						&& !isLineComment && !isBlockComment) {
    					
    					// found an un-commented class declaration!
    					// if we made it here, then there were no valid import
    					// statements, so this definitely won't work as a tank
    					// Nevertheless, having been born of thorough parents, I'll
    					// remove everything before it anyway to guarantee no
    					// package statement exists!
    					//
    					// (Note: this will remove the @Embedded annotation, but again:
    					// doesn't matter, it won't work as a tank anyway)
    					code = code.substring(i);
    					return code;
    				}
    			}
    			break;
    			
    		default:
    			break;
    			
    		}
    	}
    	
    	// If we're still here, it means there were no valid import statements
    	// AND no valid class declaration! Yikes.
    	//
    	// I guess we'll leave it untouched, as there's no valid Java file that
    	// meets those parameters, so we're at no risk anyway.
    	return code;
    }
    
    private static boolean containsUnapprovedImports(String code) {
    	
    	String oldCode = code;
    	
    	// pre-compile regex patterns for acceptable package names
    	Pattern[] packagePatterns = new Pattern[APPROVED_PACKAGES.length];
    	for(int i=0; i<APPROVED_PACKAGES.length; i++) {
    		packagePatterns[i] = Pattern.compile(APPROVED_PACKAGES[i]);
    	}
    	
    	// find each import statement
        int start = 0;
        int packageIdx = 0;
        int end = 0;
        int lastImport = 0;
        while (start != -1) {
        	
        	// identify substring location
        	start = code.indexOf(IMPORT_STR, lastImport);
        	packageIdx = start + IMPORT_STR.length();
        	end = code.indexOf(SEMICOLON, packageIdx);
        	
        	// stop searching if we're out of imports
        	if (start == -1) {
        		break;
        	}
        	
        	// extract import name, and check it for approval
        	String packageInQuestion = code.substring(packageIdx, end);
        	boolean packageApproved = false;
        	for(int i=0; i<packagePatterns.length; i++) {
        		Matcher match = packagePatterns[i].matcher(packageInQuestion);
        		if (match.find()) {
        			packageApproved = true;
        			break;
        		}
        	}
        	
        	// remove the import declaration if it is NOT approved
        	// set the "checked up to" index to either the end of this import
        	// or to where we removed it from appropriately
        	if (!packageApproved) {
        		code = code.replace(code.substring(start, end+1), "");
        		lastImport = start;
        	} else {
        		lastImport = end;
        	}
        }
        
        return !code.equals(oldCode);
    }

    //replace tank class (eg BasicTank) with CoreTank
    private static String toCore(String code){
        String codeCore = code;
        for(int i = 0; i < TANK_CLASSES.length; ++i){
        	codeCore = codeCore.replaceAll(TANK_CLASSES[i], CORE_TANK);
        }
        return codeCore;
    }
}
